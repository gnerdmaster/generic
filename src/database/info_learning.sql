-- Consultar registros con el valor de un campo expecífico (en este caso status)
select *
from profiles
where
    JSON_EXTRACT(value, '$.status') IS NOT NULL;

-- Consultar un campo específico (en este caso status) de varios registros (Nota: siempre a un valor string vendrán las comillas dobles incluídas con el valor del campo)
select JSON_EXTRACT(value, '$.status') as status from profiles;

-- Consultar un campo específico sin las commillas dobles (en este caso status), no importa si trae un numeric, también funciona para el, incluso para un null.
select TRIM(
        BOTH '"'
        FROM JSON_EXTRACT(value, '$.status')
    ) as estatus
from profiles;

select TRIM(
        BOTH '"'
        FROM JSON_EXTRACT(value, '$.id')
    ) as id, TRIM(
        BOTH '"'
        FROM JSON_EXTRACT(value, '$.name')
    ) as name, TRIM(
        BOTH '"'
        FROM JSON_EXTRACT(value, '$.single')
    ) as single
from profiles
where
    JSON_EXTRACT(value, '$.name') like '%Olaf%'
    and JSON_EXTRACT(value, '$.status') = 'single';

-- Renombrar un campo existente (en este caso status) y remover el campo viejo para varios registros. (Nota: en Mysql Workbench no permite hacerlo sin el WHERE al menos que lo configures en el programa)
update profiles
set
    value = JSON_REMOVE(
        JSON_SET(
            value,
            '$.status',
            JSON_EXTRACT(value, '$.recordStatus')
        ),
        '$.recordStatus'
    )
where
    id in (
        "bf19869e-6e5e-4aba-9d12-ea2e849523fa",
        "c0c08258-90c8-4676-8cdd-c1c65d0ca0ff"
    );