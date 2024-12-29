package mk.finki.ukim.mk.stocktopusbackend.service.converter;

import mk.finki.ukim.mk.stocktopusbackend.model.User;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDetailsDTO;
import org.springframework.stereotype.Service;

@Service
public interface UserConverterService {
    UserDetailsDTO convertToUserDetailsDTO(User user);
}
