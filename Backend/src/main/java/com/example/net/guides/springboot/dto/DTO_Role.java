package com.example.net.guides.springboot.dto;

public class DTO_Role {
    private Long id;
    private String name;

    public DTO_Role() {
    }

    public DTO_Role(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
