package mx.com.totalplay.smc.commons.services;


import mx.com.totalplay.smc.commons.model.ConfiguracionPaquetesDto;

import java.util.List;

public interface IConfiguracionPaqueteService {

    ConfiguracionPaquetesDto obtieneInformacionPaquetes();

    ConfiguracionPaquetesDto obtieneInformacionPaqueteById(Integer idCatPaquete);

    List<ConfiguracionPaquetesDto> obtieneInformacionPaqueteByCreadoPor(Integer creadoPor);

    ConfiguracionPaquetesDto obtieneInformacionPaqueteByIdAndCreadoPor(Integer idCatPaquete, Integer creadoPor);

    ConfiguracionPaquetesDto registraPaquetesByCreadoPor(Integer creadoPor, ConfiguracionPaquetesDto configuracionPaquete);

    ConfiguracionPaquetesDto actualizaPaquetesByCreadoPorAndIdPaquete(Integer idCatPaquete, Integer creadoPor, ConfiguracionPaquetesDto configuracionPaquete);

    void borraPaqueteByIdCatPaqueteAndCreadoPor(Integer idCatPaquete, Integer creadoPor);
}
