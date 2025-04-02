package com.example.net.guides.springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.net.guides.springboot.dto.JWTAuthResponse;
import com.example.net.guides.springboot.dto.LoginDto;
import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.service.AuthService;
import com.example.net.guides.springboot.service.UserService;

import jakarta.validation.Valid;

@Controller
public class WebController {
    private AuthService authService;
    private UserService userService;

    public WebController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/index")
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

   

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        UserDto user = new UserDto();
        model.addAttribute("user", user);
        return "register";
    }

    @PostMapping("/register/save")
    public String registration(@Valid @ModelAttribute("user") UserDto userDto,
            BindingResult result,
            Model model) {
        try {
            if (result.hasErrors()) {
                model.addAttribute("user", userDto);
                return "register";
            }

            userService.saveUser(userDto);
            return "redirect:/register?success";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Lỗi đăng ký: " + e.getMessage());
            return "register";
        }
    }

    @GetMapping("/users")
    public String users(Model model) {
        model.addAttribute("users", userService.findAllUsers());
        return "users";
    }

    @GetMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        try {
            userService.deleteUser(id);
            return "redirect:/users?delete_success";
        } catch (Exception e) {
            return "redirect:/users?delete_error";
        }
    }
}