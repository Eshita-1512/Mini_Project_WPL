--
-- PostgreSQL database dump
--


-- Dumped from database version 16.12
-- Dumped by pg_dump version 18.0

-- Started on 2026-03-19 11:00:32 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3795 (class 0 OID 16474)
-- Dependencies: 226
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.admin (admin_id, username, password, created_at) VALUES ('10', 'divi', 'divi', '2026-03-16 15:31:07.997114');


--
-- TOC entry 3785 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3799 (class 0 OID 24607)
-- Dependencies: 230
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3805 (class 0 OID 24662)
-- Dependencies: 236
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3787 (class 0 OID 16412)
-- Dependencies: 218
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('1', 'Sun Radhike', 'Deep Green with contrast border. Speciality: Traditional zari buta with rich woven pallu. Style: Pair with antique gold jewellery.', 'Pure Katan Silk', '14500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('2', 'Ganga', 'Soft Pastel Green. Speciality: All-over floral jaal weave. Style: Pearl or kundan jewellery enhances elegance.', 'Pure Katan Silk', '18500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('3', 'Chiyars', 'Aqua Teal. Speciality: Contemporary floral weave with zari pallu. Style: Minimal jewellery for a refined look.', 'Pure Katan Silk', '18500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('4', 'Shagun', 'Royal Purple. Speciality: Heavy floral brocade with grand border. Style: Temple jewellery complements the richness.', 'Pure Katan Silk', '29500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('5', 'Moh Rang De', 'Olive Green with pink contrast. Speciality: Subtle buta body with ornate zari border. Style: Statement earrings and sleek bun.', 'Pure Katan Silk', '12500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('6', 'Jalpari', 'Royal Blue. Speciality: Bold buti weave with broad zari border. Style: Silver-toned jewellery enhances look.', 'Pure Katan Silk', '10500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('7', 'Ore Manjhi', 'Midnight Black. Speciality: Artistic woven border with heritage motifs. Style: Statement choker for dramatic look.', 'Pure Katan Silk', '15500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('8', 'Gaura', 'Navy Blue. Speciality: Rich floral brocade with traditional zari border. Style: Pair with gold bangles and bold makeup.', 'Pure Katan Silk', '10500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('9', 'Hum Hai Taiyar Chalo', 'Deep Maroon. Speciality: Intricate brocade weave with broad zari pallu. Style: Bridal jewellery set for complete look.', 'Pure Katan Silk', '29500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('10', 'Virasat Ki Garmahat', 'Ivory & Black. Speciality: Heritage-inspired woven border with detailed motifs. Style: Minimal gold accessories for elegance.', 'Pure Katan Silk', '25000.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('11', 'Madhu Maas', 'Rani Pink. Speciality: Scattered buta weave with broad zari border. Style: Floral gajra with traditional jewellery.', 'Pure Katan Silk', '16500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('12', 'Sun Ri Sajani', 'Deep Magenta. Speciality: Elegant vertical woven motifs with zari pallu. Style: Statement earrings & soft curls.', 'Pure Katan Silk', '16500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('13', 'Swarna Kamal', 'Soft Gold with Turquoise border. Speciality: Subtle floral woven body with elegant contrast zari border. Style: Pair with turquoise or kundan jewellery.', 'Pure Katan Silk', '22500.00', '10', '2026-03-02 14:51:31.023957', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('14', 'Sun Radhike', 'Deep Green with contrast border. Speciality: Traditional zari buta with rich woven pallu. Style Tip: Pair with antique gold jewellery.', 'Pure Katan Silk', '14500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('15', 'Ganga', 'Soft Pastel Green. Speciality: All-over floral jaal weave. Style Tip: Pearl or kundan jewellery enhances elegance.', 'Pure Katan Silk', '18500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('16', 'Chiyars', 'Aqua Teal. Speciality: Contemporary floral weave with zari pallu. Style Tip: Minimal jewellery for a refined look.', 'Pure Katan Silk', '18500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('17', 'Shagun', 'Royal Purple. Speciality: Heavy floral brocade with grand border. Style Tip: Temple jewellery complements the richness.', 'Pure Katan Silk', '29500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('18', 'Moh Rang De', 'Olive Green with pink contrast. Speciality: Subtle buta body with ornate zari border. Style Tip: Statement earrings and sleek bun.', 'Pure Katan Silk', '12500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('19', 'Jalpari', 'Royal Blue. Speciality: Bold buti weave with broad zari border. Style Tip: Silver-toned jewellery enhances look.', 'Pure Katan Silk', '10500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('20', 'Ore Manjhi', 'Midnight Black. Speciality: Artistic woven border with heritage motifs. Style Tip: Statement choker for dramatic look.', 'Pure Katan Silk', '15500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('21', 'Gaura', 'Navy Blue. Speciality: Rich floral brocade with traditional zari border. Style Tip: Pair with gold bangles and bold makeup.', 'Pure Katan Silk', '10500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('22', 'Hum Hai Taiyar Chalo', 'Deep Maroon. Speciality: Intricate brocade weave with broad zari pallu. Style Tip: Bridal jewellery set for complete look.', 'Pure Katan Silk', '29500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('23', 'Virasat Ki Garmahat', 'Ivory & Black. Speciality: Heritage-inspired woven border with detailed motifs. Style Tip: Minimal gold accessories for elegance.', 'Pure Katan Silk', '25000.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('24', 'Madhu Maas', 'Rani Pink. Speciality: Scattered buta weave with broad zari border. Style Tip: Floral gajra with traditional jewellery.', 'Pure Katan Silk', '16500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('25', 'Sun Ri Sajani', 'Deep Magenta. Speciality: Elegant vertical woven motifs with zari pallu. Style Tip: Statement earrings & soft curls.', 'Pure Katan Silk', '16500.00', '10', '2026-03-02 15:23:38.532907', NULL);
INSERT INTO public.products (product_id, name, description, fabric, original_price, stock_quantity, created_at, category_id) VALUES ('26', 'Swarna Kamal', 'Soft Gold with Turquoise border. Speciality: Subtle floral woven body with elegant contrast zari border. Style Tip: Pair with kundan jewellery.', 'Pure Katan Silk', '22500.00', '10', '2026-03-02 15:23:38.532907', NULL);


--
-- TOC entry 3801 (class 0 OID 24623)
-- Dependencies: 232
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3803 (class 0 OID 24645)
-- Dependencies: 234
-- Data for Name: contact_inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3789 (class 0 OID 16422)
-- Dependencies: 220
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3791 (class 0 OID 16436)
-- Dependencies: 222
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3793 (class 0 OID 16453)
-- Dependencies: 224
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3797 (class 0 OID 24591)
-- Dependencies: 228
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3811 (class 0 OID 0)
-- Dependencies: 225
-- Name: admin_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_admin_id_seq', 1, false);


--
-- TOC entry 3812 (class 0 OID 0)
-- Dependencies: 229
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 1, false);


--
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 231
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_cart_item_id_seq', 1, false);


--
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 235
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 1, false);


--
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 233
-- Name: contact_inquiries_inquiry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_inquiries_inquiry_id_seq', 1, false);


--
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 221
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 1, false);


--
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 219
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 1, false);


--
-- TOC entry 3818 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 26, true);


--
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 223
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- TOC entry 3820 (class 0 OID 0)
-- Dependencies: 227
-- Name: shipping_addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_addresses_address_id_seq', 1, false);


--
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);


-- Completed on 2026-03-19 11:00:32 IST

--
-- PostgreSQL database dump complete
--


