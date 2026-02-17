package uk.ac.rhul.teamproject36.backend.menu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    /** Scale for the price column. */
    private static final int PRICE_SCALE = 2;

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
    @Column(nullable = false, precision = PRICE_PRECISION, scale = PRICE_SCALE)
    private BigDecimal price;

    /** The calorie count of the menu item. */
    private Integer calories;

    /**
     * Allergens stored as TEXT for now.
     * Later this will be replaced with a join table (ManyToMany).
     */
    @Column(columnDefinition = "TEXT")
    private String allergens;

    /** Whether the menu item is currently available. */
    @Column(name = "is_available", nullable = false)
    private boolean available = true;

    /** Image URL for the menu item. */
    @Column(name = "image_url")
    private String imageUrl;

    /** Whether the item is vegetarian. */
    @Column(name = "is_vegetarian")
    private boolean vegetarian;

    /** Whether the item is halal. */
    @Column(name = "is_halal")
    private boolean halal;

    /** The item type (FOOD, DESSERT, DRINK). */
    @Enumerated(EnumType.STRING)
    @Column(name = "item_type")
    private ItemType itemType;

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

    /**
     * Returns the image URL.
     *
     * @return the image URL
     */
    public String getImageUrl() {
        return imageUrl;
    }

    /**
     * Sets the image URL.
     *
     * @param newImageUrl the new image URL
     */
    public void setImageUrl(final String newImageUrl) {
        this.imageUrl = newImageUrl;
    }

    /**
     * Returns whether the item is vegetarian.
     *
     * @return true if vegetarian, false otherwise
     */
    public boolean isVegetarian() {
        return vegetarian;
    }

    /**
     * Sets whether the item is vegetarian.
     *
     * @param newVegetarian new vegetarian flag
     */
    public void setVegetarian(final boolean newVegetarian) {
        this.vegetarian = newVegetarian;
    }

    /**
     * Returns whether the item is halal.
     *
     * @return true if halal, false otherwise
     */
    public boolean isHalal() {
        return halal;
    }

    /**
     * Sets whether the item is halal.
     *
     * @param newHalal new halal flag
     */
    public void setHalal(final boolean newHalal) {
        this.halal = newHalal;
    }

    /**
     * Returns the item type.
     *
     * @return the item type
     */
    public ItemType getItemType() {
        return itemType;
    }

    /**
     * Sets the item type.
     *
     * @param newItemType the new item type
     */
    public void setItemType(final ItemType newItemType) {
        this.itemType = newItemType;
    }
}
