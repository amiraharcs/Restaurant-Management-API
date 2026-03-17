package uk.ac.rhul.teamproject36.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.backend.dataTransferObjects.EmployeeDataResponse;
import uk.ac.rhul.teamproject36.backend.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("api")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/employee/data")
    public ResponseEntity<List<EmployeeDataResponse>> getAllEmployeeData() {
        return ResponseEntity.ok(employeeService.getAllEmployeeData());
    }
}
