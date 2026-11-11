-- Sample seed data for Digital Product Passport demonstrator
-- Run after schema.sql

insert into products (id, name, model, manufacturer, attributes, created_at)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'EcoPhone X',
    'EPX-2026',
    'Northwind Electronics',
    '{"category":"Smartphone","color":"Midnight","serialNumber":"SN-EPX-0001"}',
    '2026-01-10T08:00:00Z'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'SoundBeam Speaker',
    'SBS-500',
    'Contoso Audio',
    '{"category":"Speaker","color":"Silver","serialNumber":"SN-SBS-0420"}',
    '2026-02-05T09:30:00Z'
  );

insert into events (product_id, event_type, actor, location, notes, attributes, created_at)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'manufactured',
    'Northwind Factory A',
    'Shenzhen, CN',
    'Unit assembled and passed quality checks.',
    '{"batch":"A-100"}',
    '2026-01-10T10:00:00Z'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'shipped',
    'Northwind Logistics',
    'Shenzhen, CN',
    'Shipped to regional distribution center.',
    '{"carrier":"DHL","tracking":"DHL123456"}',
    '2026-01-12T14:30:00Z'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'repaired',
    'FixIt Service Center',
    'Berlin, DE',
    'Replaced display module under warranty.',
    '{"component":"display"}',
    '2026-03-02T11:15:00Z'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'manufactured',
    'Contoso Plant 2',
    'Gdansk, PL',
    'Initial production run completed.',
    '{"batch":"B-77"}',
    '2026-02-05T10:00:00Z'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'shipped',
    'Contoso Logistics',
    'Gdansk, PL',
    'Dispatched to retailer warehouse.',
    '{"carrier":"UPS","tracking":"UPS987654"}',
    '2026-02-07T09:00:00Z'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'inspected',
    'Retail QA Team',
    'Amsterdam, NL',
    'Incoming inspection passed; no issues found.',
    '{}',
    '2026-02-10T13:45:00Z'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'recycled',
    'GreenCycle BV',
    'Rotterdam, NL',
    'End-of-life recycling intake recorded.',
    '{"method":"material recovery"}',
    '2026-08-20T16:00:00Z'
  );
