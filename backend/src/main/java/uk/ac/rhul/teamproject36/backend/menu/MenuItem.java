package uk.ac.rhul.teamproject36.backend.menu;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_item")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private Integer calories;

    @Column(columnDefinition = "TEXT")
    private String allergens;

    @Column(nullable = false)
    private boolean available = true;

    public MenuItem() {}

    // getters/setters
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public String getAllergens() { return allergens; }
    public void setAllergens(String allergens) { this.allergens = allergens; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
