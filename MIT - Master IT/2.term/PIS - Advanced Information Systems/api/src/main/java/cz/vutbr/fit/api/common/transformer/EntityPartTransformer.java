package cz.vutbr.fit.api.common.transformer;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.EntityPart;

import java.nio.charset.StandardCharsets;

@ApplicationScoped
public class EntityPartTransformer {

    public static String getString(EntityPart part) throws Exception
    {
        return new String(part.getContent().readAllBytes(), StandardCharsets.UTF_8);
    }

    //Jen parser
    public static int getInt(EntityPart part) throws Exception
    {

        return Integer.parseInt(getString(part));
    }

    public static long getLong(EntityPart part) throws Exception
    {
        return Long.parseLong(getString(part));
    }

}
