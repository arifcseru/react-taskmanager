package com.bjit.taskmanager.model;

import java.sql.Date;

public class Tasks {

    private Long id;
    private Long parentId;
    private String taskTitle;
    private Date dueDate;
    private String status;

    public Tasks() {
    }

    public Tasks(Long id,Long parentId, String taskTitle, Date dueDate, String status) {
        this.id = id;
        this.parentId = parentId;
        this.taskTitle = taskTitle;
        this.dueDate = dueDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getStatus() {
        return status;
    }
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Tasks [id=" + id + ", taskTitle=" + taskTitle + "]";
    }
}
