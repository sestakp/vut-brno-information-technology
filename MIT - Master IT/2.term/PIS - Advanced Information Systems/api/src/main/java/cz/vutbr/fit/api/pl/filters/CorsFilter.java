/*
* CITE:
* URL: https://stackoverflow.com/questions/23450494/how-to-enable-cross-domain-requests-on-jax-rs-web-services
* Author: Joel Pearson
* Date: 13.5.2014
* */
package cz.vutbr.fit.api.pl.filters;

import jakarta.ws.rs.ext.Provider;

import java.io.IOException;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(final ContainerRequestContext requestContext,
                       final ContainerResponseContext cres) throws IOException {
        cres.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
        cres.getHeaders().add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
        cres.getHeaders().add("Access-Control-Allow-Credentials", "true");
        cres.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
        cres.getHeaders().add("Access-Control-Max-Age", "1209600");
    }
}
