package uk.ac.rhul.teamproject36.backend.menu;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private double price;

    private int calories;

    private String allergens;

    private boolean available = true;

    // getters and setters
}
