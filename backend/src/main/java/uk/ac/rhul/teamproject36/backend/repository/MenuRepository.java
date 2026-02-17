package uk.ac.rhul.teamproject36.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import uk.ac.rhul.teamproject36.backend.menu.ItemType;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;

/**
 * Repository for filtered menu queries.
 */
public interface MenuRepository extends JpaRepository<MenuItem, Long> {

    /**
     * Finds menu items using optional filters.
     *
     * @param itemType optional item type filter (FOOD/DESSERT/DRINK)
     * @param vegetarian optional vegetarian filter
     * @param halal optional halal filter
     * @param maxCalories optional max calories filter
     * @param allergen optional allergen substring filter
     * @return filtered menu items
     */
    @Query("""
        SELECT m FROM MenuItem m
        WHERE (:itemType IS NULL OR m.itemType = :itemType)
          AND (:vegetarian IS NULL OR m.vegetarian = :vegetarian)
          AND (:halal IS NULL OR m.halal = :halal)
          AND (:maxCalories IS NULL OR m.calories <= :maxCalories)
          AND (:allergen IS NULL OR LOWER(m.allergens) LIKE LOWER(CONCAT('%', :allergen, '%')))
        """)
    List<MenuItem> findFiltered(
        @Param("itemType") ItemType itemType,
        @Param("vegetarian") Boolean vegetarian,
        @Param("halal") Boolean halal,
        @Param("maxCalories") Integer maxCalories,
        @Param("allergen") String allergen);
}
