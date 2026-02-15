package uk.ac.rhul.teamproject36.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;

public interface MenuRepository extends JpaRepository<MenuItem, Long> { // ← MenuItem

  @Query("""
          SELECT m FROM MenuItem m
          WHERE (:category IS NULL OR LOWER(m.category) = LOWER(:category))
            AND (:vegetarian IS NULL OR m.vegetarian = :vegetarian)
            AND (:glutenFree IS NULL OR m.glutenFree = :glutenFree)
      """)
  List<MenuItem> findFiltered(@Param("category") String category,
      @Param("vegetarian") Boolean vegetarian, @Param("glutenFree") Boolean glutenFree);
}
