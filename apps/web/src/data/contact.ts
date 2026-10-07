import { LAB_LOCATION } from "@/lib/content-types";

export const HQ_ADDRESS_LINES = LAB_LOCATION.address.split("\n");
export const HQ_COORDS = { lat: LAB_LOCATION.lat, lng: LAB_LOCATION.lng };
