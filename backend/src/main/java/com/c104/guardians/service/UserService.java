package com.c104.guardians.service;

import com.c104.guardians.dto.SignUp;
import com.c104.guardians.entity.Department;
import com.c104.guardians.entity.User;
import com.c104.guardians.repository.DepartmentRepository;
import com.c104.guardians.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public void signUp(SignUp signUpDto) {
        Department department = departmentRepository.findById(signUpDto.getDeptId())
                .orElseThrow();

        User user = new User(signUpDto, department);
        userRepository.save(user);
    }
}
