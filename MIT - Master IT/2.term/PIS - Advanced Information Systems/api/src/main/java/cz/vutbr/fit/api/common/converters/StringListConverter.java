package cz.vutbr.fit.api.common.converters;
/*
* Author: TylerH
* Cite Date: 10.2.2023
* URL: https://stackoverflow.com/questions/287201/how-to-persist-a-property-of-type-liststring-in-jpa
* */
import java.util.Arrays;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import static java.util.Collections.*;

@ApplicationScoped
@Converter(autoApply = true)
public class StringListConverter implements AttributeConverter<List<String>, String> {
    private static final String SPLIT_CHAR = ";";

    @Override
    public String convertToDatabaseColumn(List<String> stringList) {
        return stringList != null ? String.join(SPLIT_CHAR, stringList) : "";
    }

    @Override
    public List<String> convertToEntityAttribute(String string) {
        return string != null ? Arrays.asList(string.split(SPLIT_CHAR)) : emptyList();
    }
}