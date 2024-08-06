package com.c104.guardians.controller;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/")
public class MainController {
    @GetMapping("check")
    public String check() {
        return "Success";
    }
}