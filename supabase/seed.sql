-- Sample seed data for Digital Product Passport demonstrator (funding pitch demo)
-- Run after schema.sql. All compliance/sustainability values below are DEMO DATA.
-- Deletes previous demo rows (including legacy sample IDs) before inserting fresh data.

delete from events
where product_id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6',
  '8c1d4e72-0a9b-4f3c-b6d2-5e91a7c34f80',
  'a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5',
  '5b92d7e4-6c10-4f8a-a2d3-91e4c7b6f205',
  'c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74',
  '2e8b5f14-9c73-4a06-bd21-7f4c9a3e6d18'
);

delete from products
where id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6',
  '8c1d4e72-0a9b-4f3c-b6d2-5e91a7c34f80',
  'a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5',
  '5b92d7e4-6c10-4f8a-a2d3-91e4c7b6f205',
  'c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74',
  '2e8b5f14-9c73-4a06-bd21-7f4c9a3e6d18'
);

insert into products (id, name, model, manufacturer, attributes, created_at)
values
  (
    '3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6',
    'Aurora One Smartphone',
    'AUR-1-2025',
    'Nordic Devices AB',
    jsonb_build_object(
      'industry','electronics',
      'category','Smartphone',
      'color','Graphite',
      'serialNumber','ND-AUR1-20491',
      'recycled_content_pct',28,
      'carbon_footprint_kg',62,
      'repairability_score',7.8,
      'materials', jsonb_build_array(
        jsonb_build_object('name','Aluminum frame','origin_country','Norway'),
        jsonb_build_object('name','OLED display module','origin_country','South Korea'),
        jsonb_build_object('name','Lithium-ion cell','origin_country','Japan'),
        jsonb_build_object('name','Recycled plastic back','origin_country','Sweden')
      ),
      'compliance_status','Demo data: EU DPP readiness (electronics) - documentation prepared'
    ),
    '2024-11-12T08:15:00Z'
  ),
  (
    '8c1d4e72-0a9b-4f3c-b6d2-5e91a7c34f80',
    'PulseBuds Pro',
    'PB-PRO-2',
    'Sonic Works Ltd',
    jsonb_build_object(
      'industry','electronics',
      'category','Wireless earbuds',
      'color','Ivory',
      'serialNumber','SW-PBP2-88314',
      'recycled_content_pct',22,
      'carbon_footprint_kg',14,
      'repairability_score',5.4,
      'materials', jsonb_build_array(
        jsonb_build_object('name','Recycled ABS housing','origin_country','Germany'),
        jsonb_build_object('name','Silicone tips','origin_country','Thailand'),
        jsonb_build_object('name','Neodymium magnets','origin_country','Australia'),
        jsonb_build_object('name','Printed circuit boards','origin_country','Vietnam')
      ),
      'compliance_status','Demo data: CE & RoHS documentation on file (sample)'
    ),
    '2025-01-20T10:00:00Z'
  ),
  (
    'a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5',
    'VoltPack Home 10',
    'VPH-10-LFP',
    'HelioCell Energy',
    jsonb_build_object(
      'industry','batteries',
      'category','Home energy storage battery',
      'chemistry','LFP (Lithium Iron Phosphate)',
      'capacityKwh',10,
      'serialNumber','HC-VPH10-55207',
      'recycled_content_pct',18,
      'carbon_footprint_kg',410,
      'repairability_score',6.2,
      'materials', jsonb_build_array(
        jsonb_build_object('name','LFP cells','origin_country','China'),
        jsonb_build_object('name','Battery management system','origin_country','Germany'),
        jsonb_build_object('name','Steel enclosure','origin_country','Poland'),
        jsonb_build_object('name','Copper busbars','origin_country','Chile')
      ),
      'compliance_status','Demo data: EU Battery Regulation passport fields prepared (sample)'
    ),
    '2024-09-05T07:45:00Z'
  ),
  (
    '5b92d7e4-6c10-4f8a-a2d3-91e4c7b6f205',
    'CityRide E-Bike Module',
    'CRM-540',
    'UrbanMotion Power',
    jsonb_build_object(
      'industry','batteries',
      'category','E-bike battery pack',
      'chemistry','NMC',
      'capacityKwh',0.54,
      'serialNumber','UMP-CRM540-11980',
      'recycled_content_pct',12,
      'carbon_footprint_kg',38,
      'repairability_score',7.0,
      'materials', jsonb_build_array(
        jsonb_build_object('name','NMC pouch cells','origin_country','South Korea'),
        jsonb_build_object('name','Aluminum casing','origin_country','Italy'),
        jsonb_build_object('name','Wiring harness','origin_country','Mexico'),
        jsonb_build_object('name','Thermal interface pads','origin_country','USA')
      ),
      'compliance_status','Demo data: UN38.3 transport test summary referenced (sample)'
    ),
    '2025-03-14T09:20:00Z'
  ),
  (
    'c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74',
    'Northshore Trail Jacket',
    'NTJ-ALLW-01',
    'Alpine Thread Co.',
    jsonb_build_object(
      'industry','textiles',
      'category','Outdoor jacket',
      'color','Forest Green',
      'size','M',
      'serialNumber','ATC-NTJ01-B2407',
      'recycled_content_pct',61,
      'carbon_footprint_kg',21,
      'repairability_score',8.4,
      'materials', jsonb_build_array(
        jsonb_build_object('name','Recycled polyester shell','origin_country','Taiwan'),
        jsonb_build_object('name','Organic cotton lining','origin_country','India'),
        jsonb_build_object('name','YKK zipper','origin_country','Japan'),
        jsonb_build_object('name','PFC-free DWR finish','origin_country','Switzerland')
      ),
      'compliance_status','Demo data: Textile labeling & care information available (sample)'
    ),
    '2024-08-22T11:10:00Z'
  ),
  (
    '2e8b5f14-9c73-4a06-bd21-7f4c9a3e6d18',
    'Everyday Denim Jeans',
    'EDJ-RELAX-32',
    'BlueRiver Apparel',
    jsonb_build_object(
      'industry','textiles',
      'category','Denim jeans',
      'color','Indigo',
      'size','32/32',
      'serialNumber','BRA-EDJ32-L2502',
      'recycled_content_pct',35,
      'carbon_footprint_kg',17,
      'repairability_score',7.6,
      'materials', jsonb_build_array(
        jsonb_build_object('name','Cotton denim','origin_country','Turkey'),
        jsonb_build_object('name','Recycled cotton blend','origin_country','Spain'),
        jsonb_build_object('name','Metal rivets','origin_country','Italy'),
        jsonb_build_object('name','Care label (polyester)','origin_country','Portugal')
      ),
      'compliance_status','Demo data: Supply chain due-diligence summary (sample)'
    ),
    '2025-02-03T13:30:00Z'
  );

insert into events (product_id, event_type, actor, location, notes, attributes, created_at)
values
  -- Aurora One Smartphone (electronics)
  ('3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6','manufactured','Nordic Devices Assembly Plant','Espoo, FI','Final assembly, firmware flashed, and QA passed.','{"batch":"AUR1-2411"}','2024-11-12T10:30:00Z'),
  ('3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6','shipped','Baltic Freight Logistics','Hamburg, DE','Palletized shipment to EU distributor hub.','{"carrier":"Maersk","mode":"sea+road"}','2024-11-20T16:45:00Z'),
  ('3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6','sold','TechNova Retail','Paris, FR','Sold to consumer with 24-month warranty registration.','{"channel":"retail"}','2024-12-03T14:10:00Z'),
  ('3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6','repaired','FixPoint Service Center','Lyon, FR','Battery replacement performed; diagnostics recorded.','{"component":"battery","warranty":true}','2025-08-19T09:40:00Z'),
  ('3f7a9c2e-4b61-4d8f-9a13-7c2e5d91b4a6','refurbished','Nordic Renew Lab','Espoo, FI','Device inspected, graded A-, and packaged for resale.','{"grade":"A-"}','2026-02-11T11:25:00Z'),

  -- PulseBuds Pro (electronics)
  ('8c1d4e72-0a9b-4f3c-b6d2-5e91a7c34f80','manufactured','Sonic Works Factory','Hanoi, VN','Unit pair calibrated and packaged.','{"batch":"PBP2-2501"}','2025-01-20T12:00:00Z'),
  ('8c1d4e72-0a9b-4f3c-b6d2-5e91a7c34f80','shipped','Pacific Route Shipping','Singapore, SG','Air freight to European fulfillment center.','{"carrier":"DHL","awb":"DHL-884120"}','2025-01-24T06:30:00Z'),
  ('8c1d4e72-0a9b-4f3c-b6d2-5e91a7c34f80','sold','AudioMart Online','Amsterdam, NL','Online order delivered to end customer.','{"channel":"ecommerce"}','2025-02-02T18:05:00Z'),
  ('8c1d4e72-0a9b-4f3c-b6d2-5e91a7c34f80','repaired','AudioMart Service Desk','Rotterdam, NL','Left earbud charging fault resolved; case contacts cleaned.','{"issue":"charging"}','2025-06-16T13:20:00Z'),

  -- VoltPack Home 10 (batteries)
  ('a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5','manufactured','HelioCell Gigafactory','Ningde, CN','Module assembly and initial capacity test completed.','{"batch":"VPH10-2409"}','2024-09-05T09:00:00Z'),
  ('a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5','shipped','GreenLane Logistics','Antwerp, BE','Container received at EU port and forwarded by road.','{"carrier":"Kuehne+Nagel"}','2024-10-01T15:30:00Z'),
  ('a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5','sold','SunHome Installers','Munich, DE','Installed at residential site; commissioning report filed.','{"installer_cert":"DE-SH-441"}','2024-10-18T10:45:00Z'),
  ('a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5','repaired','HelioCell Field Service','Munich, DE','BMS firmware update and connector replacement.','{"service_type":"field"}','2025-07-09T08:50:00Z'),
  ('a4e6b1c9-2d7f-4a58-93c0-6f1b8d2e47a5','recycled','EuroBat Recovery','Lyon, FR','End-of-life intake scheduled and material recovery initiated.','{"method":"hydrometallurgical"}','2026-04-22T14:00:00Z'),

  -- CityRide E-Bike Module (batteries)
  ('5b92d7e4-6c10-4f8a-a2d3-91e4c7b6f205','manufactured','UrbanMotion Power Plant','Wrocław, PL','Pack assembled, sealed, and safety-tested.','{"batch":"CRM540-2503"}','2025-03-14T11:00:00Z'),
  ('5b92d7e4-6c10-4f8a-a2d3-91e4c7b6f205','shipped','Central EU Distribution','Vienna, AT','Delivered to e-bike OEM integration line.','{"carrier":"DB Schenker"}','2025-03-18T09:15:00Z'),
  ('5b92d7e4-6c10-4f8a-a2d3-91e4c7b6f205','sold','CityRide Bikes','Copenhagen, DK','Sold as part of e-bike bundle with serial linkage.','{"bundle":"CR-Urban-7"}','2025-04-02T12:40:00Z'),
  ('5b92d7e4-6c10-4f8a-a2d3-91e4c7b6f205','refurbished','UrbanMotion Circular Lab','Wrocław, PL','Capacity restored to 92%; casing resealed and relabeled.','{"capacity_pct":92}','2026-01-27T15:10:00Z'),

  -- Northshore Trail Jacket (textiles)
  ('c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74','manufactured','Alpine Thread Facility','Porto, PT','Cut-and-sew completed; waterproofing treatment applied.','{"batch":"NTJ01-2408"}','2024-08-22T13:00:00Z'),
  ('c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74','shipped','Iberia Textile Freight','Madrid, ES','Consolidated shipment to Nordic retail partners.','{"carrier":"XPO"}','2024-08-29T08:20:00Z'),
  ('c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74','sold','Fjord Outfitters','Stockholm, SE','Retail sale recorded with care-guide handoff.','{"channel":"retail"}','2024-09-10T16:35:00Z'),
  ('c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74','repaired','Fjord Repair Atelier','Stockholm, SE','Torn sleeve panel patched; seam resealed.','{"repair_type":"patch"}','2025-05-06T11:05:00Z'),
  ('c7f3a2d1-8b54-4e69-9f02-3d6a1b8c5e74','recycled','Nordic Fiber Recovery','Malmö, SE','Collected for textile-to-textile recycling pilot.','{"program":"fiber-recovery-pilot"}','2026-03-18T10:30:00Z'),

  -- Everyday Denim Jeans (textiles)
  ('2e8b5f14-9c73-4a06-bd21-7f4c9a3e6d18','manufactured','BlueRiver Denim Works','Izmir, TR','Stone-wash finish and quality inspection completed.','{"batch":"EDJ32-2502"}','2025-02-03T15:00:00Z'),
  ('2e8b5f14-9c73-4a06-bd21-7f4c9a3e6d18','shipped','Mediterranean Apparel Logistics','Milan, IT','Distributed to regional warehouse.','{"carrier":"GEODIS"}','2025-02-10T07:50:00Z'),
  ('2e8b5f14-9c73-4a06-bd21-7f4c9a3e6d18','sold','UrbanWear Store','Berlin, DE','In-store purchase; digital receipt linked.','{"channel":"retail"}','2025-02-22T17:20:00Z'),
  ('2e8b5f14-9c73-4a06-bd21-7f4c9a3e6d18','refurbished','BlueRiver Rewear Studio','Berlin, DE','Cleaned, minor hemming adjustment, and relisted as pre-owned.','{"condition":"pre-owned"}','2026-01-12T12:15:00Z');
