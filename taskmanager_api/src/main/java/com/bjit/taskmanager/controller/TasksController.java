package com.bjit.taskmanager.controller;

import com.bjit.taskmanager.model.Tasks;
import com.bjit.taskmanager.repository.TasksRepository;
import java.sql.Date;
import java.util.List;


import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TasksController {

    @Autowired
    TasksRepository tasksRepo;

    @GetMapping("/api/tasks")
    @ResponseBody
    public List<Tasks> getAll(@RequestParam(name = "query", required = false) String search,
            @RequestParam(name = "delete", required = false) String id) {
        if (id != null) {
            int id2 = Double.valueOf(id).intValue();
            tasksRepo.deleteItem(id2);
        }
        if (search != null) {
            return tasksRepo.getSearch(search);
        } else {
            return tasksRepo.getAll();
        }
    }

    @PostMapping(value = "/api/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Tasks createTask(@RequestBody String payload) {
        int added = 0;
        int updatedID = 0;
        Tasks rs;

        try {
            JSONParser parser = new JSONParser();
            Object object = parser.parse(payload);
            JSONObject jsonObject = (JSONObject) object;
            // If 'id' in JSON payload is not null, get me the true int value of 'id' or set it to 0
            
            Long parentId = Double.valueOf(jsonObject.get("parentId").toString()).longValue();
            String statusStr = (String) jsonObject.get("status");
            String taskTitleStr = (String) jsonObject.get("taskTitle");
            String dueDate = (String) jsonObject.get("dueDate");
            // If 'id' is greater than zero, we are updating an existing note
            added = tasksRepo.add(parentId,statusStr,taskTitleStr,Date.valueOf(dueDate));
            
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new Tasks(null,null, e.getMessage(), null, null);
        }
        if (added == 0) {
            System.out.println("added:" + added);
            System.out.println("id:" + updatedID);
            rs = tasksRepo.get(updatedID);
        } else {
            rs = tasksRepo.getLast();
        }
        return new Tasks(rs.getId(),rs.getParentId(), rs.getTaskTitle(),rs.getDueDate(),rs.getStatus());

    }
    
    @PutMapping(value = "/api/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Tasks updateTask(@RequestBody String payload) {
        int added = 0;
        int updatedID = 0;
        Tasks rs;

        try {
            JSONParser parser = new JSONParser();
            Object object = parser.parse(payload);
            JSONObject jsonObject = (JSONObject) object;
            // If 'id' in JSON payload is not null, get me the true int value of 'id' or set it to 0
            int i = jsonObject.get("id") != null ? Double.valueOf(jsonObject.get("id").toString()).intValue() : 0;
            Long parentId = Double.valueOf(jsonObject.get("parentId").toString()).longValue();
            String statusStr = (String) jsonObject.get("status");
            String taskTitleStr = (String) jsonObject.get("taskTitle");
            String dueDate = (String) jsonObject.get("dueDate");
            // If 'id' is greater than zero, we are updating an existing note
            updatedID = tasksRepo.update(i, parentId,statusStr,taskTitleStr,Date.valueOf(dueDate));
        } catch (Exception e) {
            return new Tasks(null,null, e.getMessage(), null, null);
        }
        if (updatedID != 0) {
            rs = tasksRepo.get(updatedID);
            return new Tasks(rs.getId(),rs.getParentId(), rs.getTaskTitle(),rs.getDueDate(),rs.getStatus());
        } else {
            // rs = tasksRepo.getLast();
            return null;
        }
        

    }

    @GetMapping("/api/tasks/{id}")
    public Tasks getTaskById(@PathVariable(value = "id") int noteId) {
        try {
            return tasksRepo.get(noteId);
        } catch (Exception e) {
            return new Tasks(null,null, "The note id " + noteId + " does not exist.",null,null);
        }

    }

        /**
         * This is hacky, but when you delete a note, the list of tasks is returned whether it succeeds or fails 
         * Technically, frontend could check for length to identify/resolve an error in deletion (non-existing note)
         * Orginally I was returning a string here with success or error - but thats not very REST-y
         */
    @DeleteMapping(value = "/api/tasks/{id}")
    @ResponseBody
    public List<Tasks> deleteItem(@PathVariable(value = "id") int itemId) {

        try {
            Tasks tasks = tasksRepo.get(itemId);
            if (tasks.getParentId()==5) {
                tasksRepo.deleteItem(itemId);
            } else {
               tasks.setParentId(Long.valueOf(5));
               tasksRepo.update(tasks.getId().intValue(), tasks.getParentId(),tasks.getStatus(),tasks.getTaskTitle(),tasks.getDueDate()); 
            }
            
        } catch (Exception e) {
            return tasksRepo.getAll();
        }

        return tasksRepo.getAll();
    }

}