package mx.com.totalplay.smc.commons.utils;

import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;


@Component
public class EncriptacionAESApi {
	
	/**
    Función para encriptación de un String mediante algoritmo AES     
     @param llave tipo String a utilizar
     @param texto el texto a encriptar
     @return el texto cifrado en modo String codificado en base64
     @throws Exception excepciones que puede devolver: NoSuchAlgorithmException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException
    */
    public String encriptar(String texto) throws NoSuchAlgorithmException, NoSuchPaddingException,
    InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    	
//    	SecretKeySpec sKeySpec = this.crearLlave(Constantes.LLAVE_ENCRIPT);
//    	SecretKeySpec sKeySpec = this.crearLlave("U2VndXJpZGFkSVRTTTIwMTg=");
    	SecretKeySpec sKeySpec = this.crearLlave("$3ncr1pSMCTPt0$#.S3cRe7=");
    	Cipher cipher = Cipher.getInstance("AES");
    	cipher.init(Cipher.ENCRYPT_MODE, sKeySpec);
    	
    	byte[] cadena = texto.getBytes();
    	byte[] cripted = cipher.doFinal(cadena);
    	
    	String sCripted = Base64.getEncoder().encodeToString(cripted);
    	
    	return sCripted;
    	
    }
    
    /**
    Función para desencriptar un String mediante algoritmo AES     
     @param llave tipo String a utilizar
     @param data el texto a desencriptar previamente encriptado con la misma llave y codificado en base64
     @return el texto descrifrado en modo String codificado en base64
     @throws Exception excepciones que puede devolver: NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException
    */
    public String desencriptar(String data) throws NoSuchAlgorithmException, NoSuchPaddingException,
    InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    	
//    	SecretKeySpec sKeySpec = this.crearLlave(Constantes.LLAVE_ENCRIPT);
//    	SecretKeySpec sKeySpec = this.crearLlave("U2VndXJpZGFkSVRTTTIwMTg=");
    	SecretKeySpec sKeySpec = this.crearLlave("$3ncr1pSMCTPt0$#.S3cRe7=");
    	
    	Cipher cipher = Cipher.getInstance("AES");
    	cipher.init(Cipher.DECRYPT_MODE, sKeySpec);
    	
    	byte[] cadena = Base64.getDecoder().decode(data); 
    	byte[] decripted = cipher.doFinal(cadena);
    	
    	String sDecripted = new String(decripted);
    	
    	return sDecripted;
    	
    }
    
    /*	
     * Crea una llave secreta para la encriptación y desencriptacion
     * @param key: la clave a implementar
     * @return la llave secreta
     */
    private SecretKeySpec crearLlave (String key) throws NoSuchAlgorithmException {
    	
    	byte[] cadena = key.getBytes();
    	MessageDigest md = MessageDigest.getInstance("SHA-1");
    	cadena = md.digest(cadena);
    	cadena = Arrays.copyOf(cadena, 16);
    	SecretKeySpec secKeySpec = new SecretKeySpec(cadena, "AES");
    	
    	return secKeySpec;
    	
    }

}
