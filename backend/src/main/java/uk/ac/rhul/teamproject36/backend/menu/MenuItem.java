package uk.ac.rhul.teamproject36.backend.menu;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

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
    @Column(name = "item_id")
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

    @Column(name = "cost_to_produce", nullable = false, precision = PRICE_PRECISION, scale = PRICE_SCALE)
    private BigDecimal costToProduce;

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

    /** Whether the item is meat. */
    @Column(name = "is_meat")
    private boolean meat;

    /** The item type (FOOD, DESSERT, DRINK). */
    @Enumerated(EnumType.STRING)
    @Column(name = "item_type")
    private ItemType itemType;

    /** Whether the item is vegan. */
    @Column(name = "is_vegan")
    private boolean vegan;

    /** Whether the item is gluten-free. */
    @Column(name = "is_gluten_free")
    private boolean glutenFree;

    /**
     * Ingredients of the menu item.
     */
    @ManyToMany
    @JoinTable(
        name = "menu_item_ingredient",
        joinColumns = @JoinColumn(name = "menu_item_id"),
        inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    private Set<Ingredient> ingredients = new HashSet<>();


    /**
     * Default constructor for JPA.
     */
    public MenuItem() { }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String newName) {
        this.name = newName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String newDescription) {
        this.description = newDescription;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(final BigDecimal newPrice) {
        this.price = newPrice;
    }

    public BigDecimal getCostToProduce() {
        return costToProduce;
    }

    public void setCostToProduce(BigDecimal costToProduce) {
        this.costToProduce = costToProduce;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(final Integer newCalories) {
        this.calories = newCalories;
    }

    public String getAllergens() {
        return allergens;
    }

    public void setAllergens(final String newAllergens) {
        this.allergens = newAllergens;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(final boolean newAvailable) {
        this.available = newAvailable;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(final String newImageUrl) {
        this.imageUrl = newImageUrl;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public void setVegetarian(final boolean newVegetarian) {
        this.vegetarian = newVegetarian;
    }

    public boolean isMeat() {
        return meat;
    }

    public void setMeat(boolean meat) {
        this.meat = meat;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(final ItemType newItemType) {
        this.itemType = newItemType;
    }

    public boolean isVegan() {
        return vegan;
    }

    public void setVegan(final boolean newVegan) {
        this.vegan = newVegan;
    }

    public boolean isGlutenFree() {
        return glutenFree;
    }

    public void setGlutenFree(final boolean newGlutenFree) {
        this.glutenFree = newGlutenFree;
    }

    public Set<Ingredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(final Set<Ingredient> newIngredients) {
        this.ingredients = newIngredients;
    }
}
