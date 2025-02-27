package com.example.taskapi.controller;

import com.example.taskapi.model.Task;
import com.example.taskapi.model.TaskExecution;
import com.example.taskapi.repository.TaskRepository;
import com.example.taskapi.service.KubernetesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private KubernetesService kubernetesService;

    // GET tasks: Fetch all tasks or a specific task by ID
    @GetMapping
    public ResponseEntity<?> getTasks(@RequestParam(value = "id", required = false) String id) {
        if (id != null) {
            Optional<Task> task = taskRepository.findById(id);
            return task.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }

    // POST /tasks/{id}/execute: Execute the task command and return the output
    @PostMapping("/{id}/execute")
    public ResponseEntity<String> executeTask(@PathVariable String id) {
        Optional<Task> optTask = taskRepository.findById(id);
        if (!optTask.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        Task task = optTask.get();
        try {
            // Log the command being executed for debugging
            System.out.println("Executing command: " + task.getCommand());
            String output = kubernetesService.runCommandInPod(task.getCommand());
            return ResponseEntity.ok(output);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error executing command: " + e.getMessage());
        }
    }

    // PUT /tasks: Create or update a task with command validation
    @PutMapping
    public ResponseEntity<?> createOrUpdateTask(@RequestBody Task task) {
        Pattern safePattern = Pattern.compile("^[a-zA-Z0-9_\\-\\s!@#$%^&*()+=:;,.]+$");
        if (!safePattern.matcher(task.getCommand()).matches()) {
            return ResponseEntity.badRequest().body("Unsafe command detected");
        }
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    // DELETE /tasks/{id}: Delete a task by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        taskRepository.deleteById(id);
        return ResponseEntity.ok("Task deleted");
    }

    // GET /tasks/search: Search tasks by name
    @GetMapping("/search")
    public ResponseEntity<?> searchTasksByName(@RequestParam("name") String name) {
        List<Task> tasks = taskRepository.findByNameContaining(name);
        if (tasks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tasks found");
        }
        return ResponseEntity.ok(tasks);
    }

    // PUT /tasks/{id}/executions: Record a task execution with start/end time and output
    @PutMapping("/{id}/executions")
    public ResponseEntity<?> recordTaskExecution(@PathVariable String id) {
        Optional<Task> optTask = taskRepository.findById(id);
        if (!optTask.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        Task task = optTask.get();
        TaskExecution exec = new TaskExecution();
        exec.setStartTime(new Date());
        try {
            String output = kubernetesService.runCommandInPod(task.getCommand());
            exec.setOutput(output);
        } catch (Exception e) {
            exec.setOutput("Error executing command: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exec);
        }
        exec.setEndTime(new Date());
        task.getTaskExecutions().add(exec);
        taskRepository.save(task);
        return ResponseEntity.ok(exec);
    }
}
