package mx.com.totalplay.smc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import mx.com.totalplay.smc.entities.TbVClientes;
import mx.com.totalplay.smc.entities.VClientesId;

public interface IVClienteRepository extends JpaRepository<TbVClientes, VClientesId> {

}
