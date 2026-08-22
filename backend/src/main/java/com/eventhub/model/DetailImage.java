package com.eventhub.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class DetailImage {
    private String url;
    private String placement;

    protected DetailImage() {}
    public DetailImage(String url, String placement) { this.url = url == null ? "" : url.trim(); this.placement = placement == null ? "DETAILS" : placement; }
    public String getUrl() { return url; }
    public String getPlacement() { return placement; }
}
