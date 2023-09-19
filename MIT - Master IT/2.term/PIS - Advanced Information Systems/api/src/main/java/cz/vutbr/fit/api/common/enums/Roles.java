package cz.vutbr.fit.api.common.enums;

public enum Roles {

    MANAGER("MANAGER"),
    CUSTOMER("CUSTOMER");

    private String name;

    private Roles(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
