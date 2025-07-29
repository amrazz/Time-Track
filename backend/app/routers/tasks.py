from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger
from database.db_config import task_db
from utils.counter import get_next_sequence
from deps import get_current_user
from database.schemas.auth import UserModel
from database.schemas.tasks import TaskModel, UpdateTask

router = APIRouter()


def serialize_mongo_doc(doc):
    return {**doc, "_id": str(doc["_id"])}


@router.post("/create-task")
def create_task(
    task_data: TaskModel, current_user: Annotated[UserModel, Depends(get_current_user)]
):
    try:
        logger.info(f"Current user : {current_user}")
        user_id = current_user["id"]
        task_dict = task_data.dict()

        task_dict["user_id"] = user_id
        task_dict["id"] = str(get_next_sequence("task_id"))

        task_db.insert_one(task_dict)

        return {"detail": "Task created successfully", "status_code": status.HTTP_201_CREATED}

    except Exception as e:
        raise HTTPException(
            status=status.HTTP_400_BAD_REQUEST,
            detail=f"Error while adding new task : {str(e)}",
        )


@router.get("/get-task")
async def get_task(
    current_user: Annotated[UserModel, Depends(get_current_user)],
    task_id: int | None = None,
):
    try:
        if task_id:
            task = task_db.find_one(
                {"task_id": str(task_id), "user_id": str(current_user["id"])}
            )
            if not task:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Task not found."
                )

            return {
                "task": serialize_mongo_doc(task),
                "status_code": status.HTTP_200_OK,
            }
        else:
            tasks_cursor = task_db.find({"user_id": str(current_user["id"])})
            tasks = [serialize_mongo_doc(task) for task in tasks_cursor]
        return {"task": tasks, "status_code": status.HTTP_200_OK}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error while getting task(s): {str(e)}",
        )


@router.patch("/update-task/{task_id}")
async def update_task(
    current_user: Annotated[UserModel, Depends(get_current_user)],
    task_id: int,
    task_data: UpdateTask,
):
    try:
        logger.info(f"[UPDATE] Request to update task {task_id} & type of task_id {type(task_id)} by user {current_user['id']} & type of user_id {type(current_user["id"])}")

        existing_task = task_db.find_one(
            {"id": str(task_id), "user_id": str(current_user["id"])}
        )

        if not existing_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found for update.",
            )

        update_data = task_data.dict(exclude_unset=True)
        logger.debug(f"[UPDATE] Incoming update data: {update_data}")

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided to update.",
            )

        update_data["updated_at"] = datetime.utcnow()

        res = task_db.update_one(
            {"id": str(task_id), "user_id": str(current_user["id"])},
            {"$set": update_data},
        )

        if res.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task update failed or no changes were made.",
            )
        logger.info(f"[UPDATE] Task {task_id} updated successfully by user {current_user['id']}")
        return {"message": "Task updated successfully.", "status_code": status.HTTP_200_OK,}

    except Exception as e:
        logger.error(f"[UPDATE] Exception while updating task {task_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error while updating task: {str(e)}",
        )


@router.delete("/delete-task/{task_id}")
async def delete_task(
    current_user: Annotated[UserModel, Depends(get_current_user)],
    task_id: int,
):
    try:

        res = task_db.delete_one(
            {
                "id": str(task_id),
                "user_id": str(current_user["id"]),
            }
        )
        logger.info(f"This is the task and user ID : {task_id}, {current_user["id"]}")
        logger.info(f"This is the res of data : ${res}")
        if res.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or already deleted.",
            )
        return {
            "message": f"Task {task_id} deleted successfully.",
            "status_code": status.HTTP_200_OK,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error while deleting task: {str(e)}",
        )
