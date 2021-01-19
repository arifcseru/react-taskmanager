package com.bjit.taskmanager.repository;


import com.bjit.taskmanager.model.Tasks;
import java.sql.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TasksRepository {

    @Autowired
    JdbcTemplate template;

    /* Getting all */
    public List<Tasks> getAll() {
        List<Tasks> items = template.query("select id,parentId,taskTitle,dueDate,status from TASKS", (result,
                rowNum) -> new Tasks(result.getLong("id"),result.getLong("parentId"), result.getString("taskTitle"),result.getDate("dueDate"), result.getString("status")));
        return items;
    }

    /* Getting all name by query string */
    public List<Tasks> getSearch(String search) {
        List<Tasks> items = template.query("SELECT * FROM TASKS WHERE taskTitle LIKE ?", (result,
                rowNum) -> new Tasks(result.getLong("id"),result.getLong("parentId"), result.getString("taskTitle"),result.getDate("dueDate"), result.getString("status")),
                "%" + search + "%");
        return items;
    }

    /* Getting by id */
    public Tasks get(int search) {
        Tasks items = template.queryForObject("SELECT * FROM TASKS WHERE ID=?", (result,
                rowNum) -> new Tasks(result.getLong("id"),result.getLong("parentId"), result.getString("taskTitle"),result.getDate("dueDate"), result.getString("status")),
                search);
        return items;
    }

    /* Adding into database table */
    public int add(Long parentId,String status, String taskTitle, Date dueDate) {
        String query = "INSERT INTO TASKS (parentId,status,taskTitle,dueDate) VALUES(?,?,?,?)";
        return template.update(query, parentId,status,taskTitle,dueDate);
    }

    /** 
     * update a note or insert a note if tat ID doesn't exist
    */
    public int update(int id,Long parentId,String status, String taskTitle, Date dueDate) {
        String checkid = "SELECT * FROM TASKS WHERE ID="+id;
        String insertion = "INSERT INTO TASKS (parentId,status,taskTitle,dueDate) VALUES(?,?,?,?)";
        String updated = "UPDATE  TASKS SET parentId = ?2 ,status = ?3 ,taskTitle = ?4, dueDate = ?5 WHERE ID = ?1";
        Tasks items = template.queryForObject(checkid, (result, rowNum) -> new Tasks(result.getLong("id"),result.getLong("parentId"), result.getString("taskTitle"),result.getDate("dueDate"), result.getString("status")));
        //if the body of the note we tried to get does isn't empty, do updated, otherwise, do insertion
        if (items.getTaskTitle() != "") {
            return template.update(updated, id, parentId,status, taskTitle,dueDate);
        } else {
           return template.update(insertion,parentId,status, taskTitle,dueDate);
        }
       
    }
    /**
     *  get the last note
     */
    public Tasks getLast() {
        Tasks items = template.queryForObject("SELECT * from TASKS WHERE id=(SELECT max(id) FROM TASKS)", (result,
                rowNum) -> new Tasks(result.getLong("id"),result.getLong("parentId"), result.getString("taskTitle"),result.getDate("dueDate"), result.getString("status")));
        return items;
    }

    /* Delete an item */
    public int deleteItem(int id) {
        String query = "DELETE FROM TASKS WHERE ID =?";
        return template.update(query, id);
    }
}
