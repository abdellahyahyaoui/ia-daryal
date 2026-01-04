import obd
import logging
import random

logger = logging.getLogger(__name__)

def get_obd_data():
    """
    Obtiene telemetría detallada del vehículo.
    En producción (APK), intentará conectar con el hardware real.
    """
    try:
        # Intentar conectar con el adaptador
        ports = obd.scan_serial()
        if not ports:
            logger.warning("No se encontraron puertos seriales para OBD")
            return {"status": "disconnected", "message": "No se detectó adaptador OBD-II"}

        connection = obd.OBD(ports[0]) 
        if not connection.is_connected():
            return {"status": "disconnected", "message": "Adaptador detectado pero no conectado al vehículo"}
        
        # Consulta de comandos reales
        commands = [
            (obd.commands.RPM, "rpm"),
            (obd.commands.COOLANT_TEMP, "temp"),
            (obd.commands.ENGINE_LOAD, "load"),
            (obd.commands.THROTTLE_POS, "throttle"),
            (obd.commands.ELM_VOLTAGE, "voltage"),
            (obd.commands.FUEL_LEVEL, "fuel_level"),
            (obd.commands.TIMING_ADVANCE, "timing_advance"),
            (obd.commands.MAF, "maf"),
        ]
        
        data = {"status": "connected", "mock": False, "dtc": []}
        
        # Obtener códigos de error reales
        dtc_response = connection.query(obd.commands.GET_DTC)
        if dtc_response and dtc_response.value:
            data["dtc"] = [c.code for c in dtc_response.value]
            
        for cmd, key in commands:
            res = connection.query(cmd)
            data[key] = str(res.value) if res and res.value is not None else "N/A"
            
        return data
    except Exception as e:
        logger.error(f"Error OBD Real: {e}")
        return {"status": "error", "message": str(e)}

def get_mock_data():
    """Genera datos de prueba realistas si no hay hardware."""
    return {
        "status": "connected",
        "mock": True,
        "dtc": ["P0300", "P0171"],
        "rpm": random.randint(750, 3000),
        "temp": f"{random.randint(85, 105)} C",
        "load": f"{random.randint(20, 80)} %",
        "throttle": f"{random.randint(10, 100)} %",
        "voltage": f"{round(random.uniform(13.2, 14.4), 1)} V",
        "fuel_level": f"{random.randint(10, 100)} %",
        "timing_advance": f"{random.randint(5, 25)} deg",
        "maf": f"{random.randint(2, 50)} g/s"
    }

def clear_obd_errors():
    """
    Intenta borrar los códigos de error (DTC) del vehículo.
    """
    try:
        ports = obd.scan_serial()
        if not ports:
            return {"status": "error", "message": "No se detectó adaptador OBD-II"}
            
        connection = obd.OBD(ports[0])
        if not connection.is_connected():
            return {"status": "error", "message": "No conectado al vehículo"}
        
        connection.query(obd.commands.CLEAR_DTC)
        return {"status": "success", "message": "Códigos borrados correctamente"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
