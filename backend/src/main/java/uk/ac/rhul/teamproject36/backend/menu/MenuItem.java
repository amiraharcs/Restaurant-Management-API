package uk.ac.rhul.teamproject36.backend.menu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

/**
 * Entity representing a menu item in the restaurant.
 */
@Entity
@Table(name = "menu_item")
public final class MenuItem {

    /** Precision for the price column. */
    private static final int PRICE_PRECISION = 10;

    /** The unique identifier for the menu item. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The name of the menu item. */
    @Column(nullable = false)
    private String name;

    /** The description of the menu item. */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** The price of the menu item. */
    @Column(nullable = false, precision = PRICE_PRECISION, scale = 2)
    private BigDecimal price;

    /** The calorie count of the menu item. */
    private Integer calories;

    /** The allergens present in the menu item. */
    @Column(columnDefinition = "TEXT")
    private String allergens;

    /** Whether the menu item is currently available. */
    @Column(nullable = false)
    private boolean available = true;

    /**
     * Default constructor for JPA.
     */
    public MenuItem() { }

    /**
     * Returns the unique identifier.
     *
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * Returns the name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name.
     *
     * @param newName the new name
     */
    public void setName(final String newName) {
        this.name = newName;
    }

    /**
     * Returns the description.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description.
     *
     * @param newDescription the new description
     */
    public void setDescription(final String newDescription) {
        this.description = newDescription;
    }

    /**
     * Returns the price.
     *
     * @return the price
     */
    public BigDecimal getPrice() {
        return price;
    }

    /**
     * Sets the price.
     *
     * @param newPrice the new price
     */
    public void setPrice(final BigDecimal newPrice) {
        this.price = newPrice;
    }

    /**
     * Returns the calories.
     *
     * @return the calories
     */
    public Integer getCalories() {
        return calories;
    }

    /**
     * Sets the calories.
     *
     * @param newCalories the new calorie count
     */
    public void setCalories(final Integer newCalories) {
        this.calories = newCalories;
    }

    /**
     * Returns the allergens.
     *
     * @return the allergens
     */
    public String getAllergens() {
        return allergens;
    }

    /**
     * Sets the allergens.
     *
     * @param newAllergens the new allergens
     */
    public void setAllergens(final String newAllergens) {
        this.allergens = newAllergens;
    }

    /**
     * Returns whether the item is available.
     *
     * @return true if available, false otherwise
     */
    public boolean isAvailable() {
        return available;
    }

    /**
     * Sets the availability.
     *
     * @param newAvailable the new availability status
     */
    public void setAvailable(final boolean newAvailable) {
        this.available = newAvailable;
    }
}
