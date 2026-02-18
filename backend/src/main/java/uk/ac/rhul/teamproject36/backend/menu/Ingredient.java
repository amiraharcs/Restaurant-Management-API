package uk.ac.rhul.teamproject36.backend.menu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entity representing an ingredient.
 */
@Entity
@Table(name = "ingredient")
public final class Ingredient {

    /** Unique identifier. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Ingredient name. */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Default constructor for JPA.
     */
    public Ingredient() { }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String newName) {
        this.name = newName;
    }
}
