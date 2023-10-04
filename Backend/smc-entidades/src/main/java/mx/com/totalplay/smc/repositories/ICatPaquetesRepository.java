/**
 *
 */
package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbUsuario;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * @author Luis Luna
 */
public interface ICatPaquetesRepository extends IGenericRepository<TbCatPaquete, Integer> {

    TbCatPaquete findByIdCatPaqueteAndCreadoPor(Integer idCatPaquete, TbUsuario usuario);

    List<TbCatPaquete> findAllByCreadoPor(TbUsuario usuario);
    
    List<TbCatPaquete> findAllByDescripcion(String descripcion);
    
    List<TbCatPaquete> findAllByTbCatEstatus(TbCatEstatus estatus);
    
    TbCatPaquete findByIdCatPaquete(Integer idCatPaquete);
    
    @Query(value = " SELECT DISTINCT cp.* FROM CatPaquetes cp, Clientes c " 
		     + " WHERE cp.idCatPaquetes = c.idCatPaquetes ", nativeQuery = true)
   List<TbCatPaquete>findByIdCatPaqueteActivosAsociados();
}
