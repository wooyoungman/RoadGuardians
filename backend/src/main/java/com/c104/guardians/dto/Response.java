package com.c104.guardians.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "set")
public class Response<D> {
    private boolean result;
    private String message;
    private D data;

    public  static <D> Response<D> setSuccess(String message) {
        return Response.set(true, message, null);
    }

    public static <D> Response<D> setFailed(String message)
    {
        return Response.set(false, message, null);
    }

    public static <D> Response<D> setSuccessData(String message, D data) {
        return Response.set(true, message, data);
    }

    public static <D> Response<D> setFailedData(String message, D data) {
        return Response.set(false, message, data);
    }
}
