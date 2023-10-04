/**
 *
 */
package mx.com.totalplay.smc.commons.services;


import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import java.util.List;

/**
 * @author Luis Luna
 */
public interface IPaqueteService extends IGenericService<TbCatPaquete, Integer> {

    TbCatPaquete findByIdPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario);

    List<TbCatPaquete> findAllByIdUsuario(Integer idUsuario);
    
    List<TbCatPaquete> findAllByTbCatEstatus(TbCatEstatus estatus);
    
    List<TbCatPaquete>findByIdCatPaqueteActivosAsociados();
}
