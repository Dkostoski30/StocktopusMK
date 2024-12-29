package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.User;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDetailsFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
    @Query(
            """
                select u from User u
                where (:#{#userFilter.username} is null or :#{#userFilter.username} = '' or lower(u.username) like :#{#userFilter.username}%)
                and (:#{#userFilter.email} is null or :#{#userFilter.email} = '' or lower(u.email) like :#{#userFilter.email}%)
                order by u.username asc
            """
    )
    Page<User> findAll(Pageable pageable, UserDetailsFilter userFilter);
}

