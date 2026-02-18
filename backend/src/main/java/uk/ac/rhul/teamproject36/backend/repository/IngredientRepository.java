
package uk.ac.rhul.teamproject36.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import uk.ac.rhul.teamproject36.backend.menu.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Optional<Ingredient> findByNameIgnoreCase(String name);
}
