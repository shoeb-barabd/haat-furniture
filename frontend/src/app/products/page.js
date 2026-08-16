"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const all128ProductsCatalog = [
  {
    "id": 1,
    "name": "Crown Royal Segun Teak Bed (Model #101)",
    "category": "Bedroom",
    "price": 22000,
    "oldPrice": 27500,
    "rating": 4.6,
    "reviews": 15,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood crown royal segun teak bed (model #101) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 2,
    "name": "Purley Luxury Marble-Top Dining Set (Model #102)",
    "category": "Dining",
    "price": 37000,
    "oldPrice": 46250,
    "rating": 4.7,
    "reviews": 22,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood purley luxury marble-top dining set (model #102) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 3,
    "name": "Chesterfield Genuine Leather 3-Seater Sofa (Model #103)",
    "category": "Living Room",
    "price": 43000,
    "oldPrice": 53750,
    "rating": 4.8,
    "reviews": 29,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chesterfield genuine leather 3-seater sofa (model #103) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 4,
    "name": "Royal Carved Heritage Executive Writing Desk (Model #104)",
    "category": "Office",
    "price": 19900,
    "oldPrice": 24875,
    "rating": 4.9,
    "reviews": 36,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved heritage executive writing desk (model #104) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 5,
    "name": "Waterproof Lacquer Polish Interior Bedroom Door (Model #105)",
    "category": "Doors",
    "price": 20500,
    "oldPrice": 25625,
    "rating": 5.0,
    "reviews": 43,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood waterproof lacquer polish interior bedroom door (model #105) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 6,
    "name": "Executive Office Storage File Almirah (Model #106)",
    "category": "Almirah & Wardrobe",
    "price": 37500,
    "oldPrice": 46875,
    "rating": 4.6,
    "reviews": 50,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive office storage file almirah (model #106) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 7,
    "name": "Solid Segun Teak Furniture Item #7 (Model #107)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 4.7,
    "reviews": 57,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #7 (model #107) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 8,
    "name": "Imperial Luxury Velvet Headboard Bed (Model #108)",
    "category": "Bedroom",
    "price": 32500,
    "oldPrice": 40625,
    "rating": 4.8,
    "reviews": 64,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood imperial luxury velvet headboard bed (model #108) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 9,
    "name": "Beijing 6-Chair Solid Segun Dining Set (Model #109)",
    "category": "Dining",
    "price": 51000,
    "oldPrice": 63750,
    "rating": 4.9,
    "reviews": 71,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood beijing 6-chair solid segun dining set (model #109) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 10,
    "name": "Classic 3+1+1 Segun Carved Velvet Sofa (Model #110)",
    "category": "Living Room",
    "price": 60500,
    "oldPrice": 75625,
    "rating": 5.0,
    "reviews": 78,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood classic 3+1+1 segun carved velvet sofa (model #110) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 11,
    "name": "Executive Boss Desk with Side Cabinet & Lock (Model #111)",
    "category": "Office",
    "price": 14500,
    "oldPrice": 18125,
    "rating": 4.6,
    "reviews": 20,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive boss desk with side cabinet & lock (model #111) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 12,
    "name": "CNC Deep Engraved Floral Teak Wooden Door (Model #112)",
    "category": "Doors",
    "price": 21500,
    "oldPrice": 26875,
    "rating": 4.7,
    "reviews": 27,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood cnc deep engraved floral teak wooden door (model #112) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 13,
    "name": "Lily 3-Door Solid Segun Wardrobe Almirah (Model #113)",
    "category": "Almirah & Wardrobe",
    "price": 34500,
    "oldPrice": 43125,
    "rating": 4.8,
    "reviews": 34,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood lily 3-door solid segun wardrobe almirah (model #113) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 14,
    "name": "Solid Segun Teak Furniture Item #14 (Model #114)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.9,
    "reviews": 41,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #14 (model #114) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 15,
    "name": "Royal Windsor Heavy Wood Bed (Model #115)",
    "category": "Bedroom",
    "price": 43000,
    "oldPrice": 53750,
    "rating": 5.0,
    "reviews": 48,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal windsor heavy wood bed (model #115) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 16,
    "name": "Executive Office Meeting & Dining Desk (Model #116)",
    "category": "Dining",
    "price": 41000,
    "oldPrice": 51250,
    "rating": 4.6,
    "reviews": 55,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive office meeting & dining desk (model #116) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 17,
    "name": "Royal 5-Seater L-Shape Sectional Sofa (Model #117)",
    "category": "Living Room",
    "price": 53000,
    "oldPrice": 66250,
    "rating": 4.7,
    "reviews": 62,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal 5-seater l-shape sectional sofa (model #117) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 18,
    "name": "Ergonomic Dual Computer Workstation Desk (Model #118)",
    "category": "Office",
    "price": 27100,
    "oldPrice": 33875,
    "rating": 4.8,
    "reviews": 69,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood ergonomic dual computer workstation desk (model #118) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 19,
    "name": "Royal Carved Double Leaf Entrance Gate Door (Model #119)",
    "category": "Doors",
    "price": 16500,
    "oldPrice": 20625,
    "rating": 4.9,
    "reviews": 76,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved double leaf entrance gate door (model #119) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 20,
    "name": "Chittagong Teak 4-Door Glass Showcase Almirah (Model #120)",
    "category": "Almirah & Wardrobe",
    "price": 31500,
    "oldPrice": 39375,
    "rating": 5.0,
    "reviews": 18,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong teak 4-door glass showcase almirah (model #120) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 21,
    "name": "Solid Segun Teak Furniture Item #21 (Model #121)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 4.6,
    "reviews": 25,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #21 (model #121) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 22,
    "name": "Victoria Carved Master Bed (Model #122)",
    "category": "Bedroom",
    "price": 31000,
    "oldPrice": 38750,
    "rating": 4.7,
    "reviews": 32,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood victoria carved master bed (model #122) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 23,
    "name": "Heritage Solid Wood Round Dining Table with Lazy Susan (Model #123)",
    "category": "Dining",
    "price": 55000,
    "oldPrice": 68750,
    "rating": 4.8,
    "reviews": 39,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood heritage solid wood round dining table with lazy susan (model #123) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 24,
    "name": "Royal Gold Brocade Velvet Cushion Sofa (Model #124)",
    "category": "Living Room",
    "price": 45500,
    "oldPrice": 56875,
    "rating": 4.9,
    "reviews": 46,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal gold brocade velvet cushion sofa (model #124) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 25,
    "name": "Executive School & Institution Student Bench Set (Model #125)",
    "category": "Office",
    "price": 21700,
    "oldPrice": 27125,
    "rating": 5.0,
    "reviews": 53,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive school & institution student bench set (model #125) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 26,
    "name": "Solid Chittagong Segun Main Entrance Security Door (Model #126)",
    "category": "Doors",
    "price": 17500,
    "oldPrice": 21875,
    "rating": 4.6,
    "reviews": 60,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid chittagong segun main entrance security door (model #126) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 27,
    "name": "Royal Carved 2-Door Segun Bedroom Almirah (Model #127)",
    "category": "Almirah & Wardrobe",
    "price": 28500,
    "oldPrice": 35625,
    "rating": 4.7,
    "reviews": 67,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved 2-door segun bedroom almirah (model #127) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 28,
    "name": "Solid Segun Teak Furniture Item #28 (Model #128)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.8,
    "reviews": 74,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #28 (model #128) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 29,
    "name": "Presidential Master Bedroom Suite (Model #129)",
    "category": "Bedroom",
    "price": 41500,
    "oldPrice": 51875,
    "rating": 4.9,
    "reviews": 16,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood presidential master bedroom suite (model #129) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 30,
    "name": "Imperial Glass-Top 8-Chair Dining Suite (Model #130)",
    "category": "Dining",
    "price": 45000,
    "oldPrice": 56250,
    "rating": 5.0,
    "reviews": 23,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood imperial glass-top 8-chair dining suite (model #130) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 31,
    "name": "Minimalist Studio Corner L-Sofa Set (Model #131)",
    "category": "Living Room",
    "price": 38000,
    "oldPrice": 47500,
    "rating": 4.6,
    "reviews": 30,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood minimalist studio corner l-sofa set (model #131) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 32,
    "name": "Chittagong Segun Solid Wood Manager Table (Model #132)",
    "category": "Office",
    "price": 16300,
    "oldPrice": 20375,
    "rating": 4.7,
    "reviews": 37,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong segun solid wood manager table (model #132) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 33,
    "name": "Modern Horizontal Panel Segun Door (Model #133)",
    "category": "Doors",
    "price": 18500,
    "oldPrice": 23125,
    "rating": 4.8,
    "reviews": 44,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern horizontal panel segun door (model #133) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 34,
    "name": "Modern Sliding Door Mirror Wardrobe Almirah (Model #134)",
    "category": "Almirah & Wardrobe",
    "price": 25500,
    "oldPrice": 31875,
    "rating": 4.9,
    "reviews": 51,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern sliding door mirror wardrobe almirah (model #134) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 35,
    "name": "Solid Segun Teak Furniture Item #35 (Model #135)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 5.0,
    "reviews": 58,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #35 (model #135) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 36,
    "name": "Pentagon Teak Bed (Model #136)",
    "category": "Bedroom",
    "price": 29500,
    "oldPrice": 36875,
    "rating": 4.6,
    "reviews": 65,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood pentagon teak bed (model #136) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 37,
    "name": "Minimalist Modern 4-Chair Segun Dining Table (Model #137)",
    "category": "Dining",
    "price": 35000,
    "oldPrice": 43750,
    "rating": 4.7,
    "reviews": 72,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood minimalist modern 4-chair segun dining table (model #137) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 38,
    "name": "Luxury Recliner Sectional Living Room Sofa (Model #138)",
    "category": "Living Room",
    "price": 55500,
    "oldPrice": 69375,
    "rating": 4.8,
    "reviews": 79,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood luxury recliner sectional living room sofa (model #138) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 39,
    "name": "Royal Carved Heritage Executive Writing Desk (Model #139)",
    "category": "Office",
    "price": 28900,
    "oldPrice": 36125,
    "rating": 4.9,
    "reviews": 21,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved heritage executive writing desk (model #139) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 40,
    "name": "Waterproof Lacquer Polish Interior Bedroom Door (Model #140)",
    "category": "Doors",
    "price": 19500,
    "oldPrice": 24375,
    "rating": 5.0,
    "reviews": 28,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood waterproof lacquer polish interior bedroom door (model #140) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 41,
    "name": "Heritage Teak 3-Drawer Dressing Almirah (Model #141)",
    "category": "Almirah & Wardrobe",
    "price": 22500,
    "oldPrice": 28125,
    "rating": 4.6,
    "reviews": 35,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood heritage teak 3-drawer dressing almirah (model #141) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 42,
    "name": "Solid Segun Teak Furniture Item #42 (Model #142)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.7,
    "reviews": 42,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #42 (model #142) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 43,
    "name": "Orchid Heavy Carving Teak Bed (Model #143)",
    "category": "Bedroom",
    "price": 40000,
    "oldPrice": 50000,
    "rating": 4.8,
    "reviews": 49,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood orchid heavy carving teak bed (model #143) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 44,
    "name": "Royal Carved 6-Seater Oval Dining Table (Model #144)",
    "category": "Dining",
    "price": 49000,
    "oldPrice": 61250,
    "rating": 4.9,
    "reviews": 56,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved 6-seater oval dining table (model #144) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 45,
    "name": "Chittagong Teak Heavy Wood Carved Sofa Set (Model #145)",
    "category": "Living Room",
    "price": 48000,
    "oldPrice": 60000,
    "rating": 5.0,
    "reviews": 63,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong teak heavy wood carved sofa set (model #145) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 46,
    "name": "Executive Boss Desk with Side Cabinet & Lock (Model #146)",
    "category": "Office",
    "price": 23500,
    "oldPrice": 29375,
    "rating": 4.6,
    "reviews": 70,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive boss desk with side cabinet & lock (model #146) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 47,
    "name": "CNC Deep Engraved Floral Teak Wooden Door (Model #147)",
    "category": "Doors",
    "price": 20500,
    "oldPrice": 25625,
    "rating": 4.7,
    "reviews": 77,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood cnc deep engraved floral teak wooden door (model #147) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 48,
    "name": "Executive Office Storage File Almirah (Model #148)",
    "category": "Almirah & Wardrobe",
    "price": 43500,
    "oldPrice": 54375,
    "rating": 4.8,
    "reviews": 19,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive office storage file almirah (model #148) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 49,
    "name": "Solid Segun Teak Furniture Item #49 (Model #149)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 4.9,
    "reviews": 26,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #49 (model #149) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 50,
    "name": "Purley Teak King Bed (Model #150)",
    "category": "Bedroom",
    "price": 28000,
    "oldPrice": 35000,
    "rating": 5.0,
    "reviews": 33,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood purley teak king bed (model #150) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 51,
    "name": "Chittagong Teak 8-Chair Executive Dining Table (Model #151)",
    "category": "Dining",
    "price": 39000,
    "oldPrice": 48750,
    "rating": 4.6,
    "reviews": 40,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong teak 8-chair executive dining table (model #151) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 52,
    "name": "Modern Scandinavian Fabric Sofa Set 3+2 (Model #152)",
    "category": "Living Room",
    "price": 40500,
    "oldPrice": 50625,
    "rating": 4.7,
    "reviews": 47,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern scandinavian fabric sofa set 3+2 (model #152) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 53,
    "name": "Ergonomic Dual Computer Workstation Desk (Model #153)",
    "category": "Office",
    "price": 18100,
    "oldPrice": 22625,
    "rating": 4.8,
    "reviews": 54,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood ergonomic dual computer workstation desk (model #153) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 54,
    "name": "Royal Carved Double Leaf Entrance Gate Door (Model #154)",
    "category": "Doors",
    "price": 21500,
    "oldPrice": 26875,
    "rating": 4.9,
    "reviews": 61,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved double leaf entrance gate door (model #154) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 55,
    "name": "Lily 3-Door Solid Segun Wardrobe Almirah (Model #155)",
    "category": "Almirah & Wardrobe",
    "price": 40500,
    "oldPrice": 50625,
    "rating": 5.0,
    "reviews": 68,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood lily 3-door solid segun wardrobe almirah (model #155) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 56,
    "name": "Solid Segun Teak Furniture Item #56 (Model #156)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.6,
    "reviews": 75,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #56 (model #156) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 57,
    "name": "Regal Solid Wood Queen Bed (Model #157)",
    "category": "Bedroom",
    "price": 38500,
    "oldPrice": 48125,
    "rating": 4.7,
    "reviews": 17,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood regal solid wood queen bed (model #157) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 58,
    "name": "Purley Luxury Marble-Top Dining Set (Model #158)",
    "category": "Dining",
    "price": 53000,
    "oldPrice": 66250,
    "rating": 4.8,
    "reviews": 24,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood purley luxury marble-top dining set (model #158) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 59,
    "name": "Chesterfield Genuine Leather 3-Seater Sofa (Model #159)",
    "category": "Living Room",
    "price": 58000,
    "oldPrice": 72500,
    "rating": 4.9,
    "reviews": 31,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chesterfield genuine leather 3-seater sofa (model #159) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 60,
    "name": "Executive School & Institution Student Bench Set (Model #160)",
    "category": "Office",
    "price": 30700,
    "oldPrice": 38375,
    "rating": 5.0,
    "reviews": 38,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive school & institution student bench set (model #160) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 61,
    "name": "Solid Chittagong Segun Main Entrance Security Door (Model #161)",
    "category": "Doors",
    "price": 16500,
    "oldPrice": 20625,
    "rating": 4.6,
    "reviews": 45,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid chittagong segun main entrance security door (model #161) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 62,
    "name": "Chittagong Teak 4-Door Glass Showcase Almirah (Model #162)",
    "category": "Almirah & Wardrobe",
    "price": 37500,
    "oldPrice": 46875,
    "rating": 4.7,
    "reviews": 52,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong teak 4-door glass showcase almirah (model #162) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 63,
    "name": "Solid Segun Teak Furniture Item #63 (Model #163)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 4.8,
    "reviews": 59,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #63 (model #163) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 64,
    "name": "Minimalist Scandinavian Teak Bed (Model #164)",
    "category": "Bedroom",
    "price": 26500,
    "oldPrice": 33125,
    "rating": 4.9,
    "reviews": 66,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood minimalist scandinavian teak bed (model #164) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 65,
    "name": "Beijing 6-Chair Solid Segun Dining Set (Model #165)",
    "category": "Dining",
    "price": 43000,
    "oldPrice": 53750,
    "rating": 5.0,
    "reviews": 73,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood beijing 6-chair solid segun dining set (model #165) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 66,
    "name": "Classic 3+1+1 Segun Carved Velvet Sofa (Model #166)",
    "category": "Living Room",
    "price": 50500,
    "oldPrice": 63125,
    "rating": 4.6,
    "reviews": 15,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood classic 3+1+1 segun carved velvet sofa (model #166) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 67,
    "name": "Chittagong Segun Solid Wood Manager Table (Model #167)",
    "category": "Office",
    "price": 25300,
    "oldPrice": 31625,
    "rating": 4.7,
    "reviews": 22,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong segun solid wood manager table (model #167) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 68,
    "name": "Modern Horizontal Panel Segun Door (Model #168)",
    "category": "Doors",
    "price": 17500,
    "oldPrice": 21875,
    "rating": 4.8,
    "reviews": 29,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern horizontal panel segun door (model #168) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 69,
    "name": "Royal Carved 2-Door Segun Bedroom Almirah (Model #169)",
    "category": "Almirah & Wardrobe",
    "price": 34500,
    "oldPrice": 43125,
    "rating": 4.9,
    "reviews": 36,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved 2-door segun bedroom almirah (model #169) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 70,
    "name": "Solid Segun Teak Furniture Item #70 (Model #170)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 5.0,
    "reviews": 43,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #70 (model #170) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 71,
    "name": "Heritage Chittagong Segun Bed (Model #171)",
    "category": "Bedroom",
    "price": 37000,
    "oldPrice": 46250,
    "rating": 4.6,
    "reviews": 50,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood heritage chittagong segun bed (model #171) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 72,
    "name": "Executive Office Meeting & Dining Desk (Model #172)",
    "category": "Dining",
    "price": 57000,
    "oldPrice": 71250,
    "rating": 4.7,
    "reviews": 57,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive office meeting & dining desk (model #172) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 73,
    "name": "Royal 5-Seater L-Shape Sectional Sofa (Model #173)",
    "category": "Living Room",
    "price": 43000,
    "oldPrice": 53750,
    "rating": 4.8,
    "reviews": 64,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal 5-seater l-shape sectional sofa (model #173) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 74,
    "name": "Royal Carved Heritage Executive Writing Desk (Model #174)",
    "category": "Office",
    "price": 19900,
    "oldPrice": 24875,
    "rating": 4.9,
    "reviews": 71,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved heritage executive writing desk (model #174) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 75,
    "name": "Waterproof Lacquer Polish Interior Bedroom Door (Model #175)",
    "category": "Doors",
    "price": 18500,
    "oldPrice": 23125,
    "rating": 5.0,
    "reviews": 78,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood waterproof lacquer polish interior bedroom door (model #175) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 76,
    "name": "Modern Sliding Door Mirror Wardrobe Almirah (Model #176)",
    "category": "Almirah & Wardrobe",
    "price": 31500,
    "oldPrice": 39375,
    "rating": 4.6,
    "reviews": 20,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern sliding door mirror wardrobe almirah (model #176) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 77,
    "name": "Solid Segun Teak Furniture Item #77 (Model #177)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 4.7,
    "reviews": 27,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #77 (model #177) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 78,
    "name": "Floral CNC Engraved Teak Bed (Model #178)",
    "category": "Bedroom",
    "price": 25000,
    "oldPrice": 31250,
    "rating": 4.8,
    "reviews": 34,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood floral cnc engraved teak bed (model #178) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 79,
    "name": "Heritage Solid Wood Round Dining Table with Lazy Susan (Model #179)",
    "category": "Dining",
    "price": 47000,
    "oldPrice": 58750,
    "rating": 4.9,
    "reviews": 41,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood heritage solid wood round dining table with lazy susan (model #179) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 80,
    "name": "Royal Gold Brocade Velvet Cushion Sofa (Model #180)",
    "category": "Living Room",
    "price": 60500,
    "oldPrice": 75625,
    "rating": 5.0,
    "reviews": 48,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal gold brocade velvet cushion sofa (model #180) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 81,
    "name": "Executive Boss Desk with Side Cabinet & Lock (Model #181)",
    "category": "Office",
    "price": 14500,
    "oldPrice": 18125,
    "rating": 4.6,
    "reviews": 55,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive boss desk with side cabinet & lock (model #181) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 82,
    "name": "CNC Deep Engraved Floral Teak Wooden Door (Model #182)",
    "category": "Doors",
    "price": 19500,
    "oldPrice": 24375,
    "rating": 4.7,
    "reviews": 62,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood cnc deep engraved floral teak wooden door (model #182) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 83,
    "name": "Heritage Teak 3-Drawer Dressing Almirah (Model #183)",
    "category": "Almirah & Wardrobe",
    "price": 28500,
    "oldPrice": 35625,
    "rating": 4.8,
    "reviews": 69,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood heritage teak 3-drawer dressing almirah (model #183) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 84,
    "name": "Solid Segun Teak Furniture Item #84 (Model #184)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.9,
    "reviews": 76,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #84 (model #184) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 85,
    "name": "Galaxy Teak Bed (Model #185)",
    "category": "Bedroom",
    "price": 35500,
    "oldPrice": 44375,
    "rating": 5.0,
    "reviews": 18,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood galaxy teak bed (model #185) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 86,
    "name": "Imperial Glass-Top 8-Chair Dining Suite (Model #186)",
    "category": "Dining",
    "price": 37000,
    "oldPrice": 46250,
    "rating": 4.6,
    "reviews": 25,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood imperial glass-top 8-chair dining suite (model #186) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 87,
    "name": "Minimalist Studio Corner L-Sofa Set (Model #187)",
    "category": "Living Room",
    "price": 53000,
    "oldPrice": 66250,
    "rating": 4.7,
    "reviews": 32,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood minimalist studio corner l-sofa set (model #187) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 88,
    "name": "Ergonomic Dual Computer Workstation Desk (Model #188)",
    "category": "Office",
    "price": 27100,
    "oldPrice": 33875,
    "rating": 4.8,
    "reviews": 39,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood ergonomic dual computer workstation desk (model #188) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 89,
    "name": "Royal Carved Double Leaf Entrance Gate Door (Model #189)",
    "category": "Doors",
    "price": 20500,
    "oldPrice": 25625,
    "rating": 4.9,
    "reviews": 46,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved double leaf entrance gate door (model #189) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 90,
    "name": "Executive Office Storage File Almirah (Model #190)",
    "category": "Almirah & Wardrobe",
    "price": 25500,
    "oldPrice": 31875,
    "rating": 5.0,
    "reviews": 53,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive office storage file almirah (model #190) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 91,
    "name": "Solid Segun Teak Furniture Item #91 (Model #191)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 4.6,
    "reviews": 60,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #91 (model #191) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 92,
    "name": "Diamond Panel Solid Segun Bed (Model #192)",
    "category": "Bedroom",
    "price": 23500,
    "oldPrice": 29375,
    "rating": 4.7,
    "reviews": 67,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood diamond panel solid segun bed (model #192) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 93,
    "name": "Minimalist Modern 4-Chair Segun Dining Table (Model #193)",
    "category": "Dining",
    "price": 51000,
    "oldPrice": 63750,
    "rating": 4.8,
    "reviews": 74,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood minimalist modern 4-chair segun dining table (model #193) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 94,
    "name": "Luxury Recliner Sectional Living Room Sofa (Model #194)",
    "category": "Living Room",
    "price": 45500,
    "oldPrice": 56875,
    "rating": 4.9,
    "reviews": 16,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood luxury recliner sectional living room sofa (model #194) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 95,
    "name": "Executive School & Institution Student Bench Set (Model #195)",
    "category": "Office",
    "price": 21700,
    "oldPrice": 27125,
    "rating": 5.0,
    "reviews": 23,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive school & institution student bench set (model #195) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 96,
    "name": "Solid Chittagong Segun Main Entrance Security Door (Model #196)",
    "category": "Doors",
    "price": 21500,
    "oldPrice": 26875,
    "rating": 4.6,
    "reviews": 30,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid chittagong segun main entrance security door (model #196) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 97,
    "name": "Lily 3-Door Solid Segun Wardrobe Almirah (Model #197)",
    "category": "Almirah & Wardrobe",
    "price": 22500,
    "oldPrice": 28125,
    "rating": 4.7,
    "reviews": 37,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood lily 3-door solid segun wardrobe almirah (model #197) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 98,
    "name": "Solid Segun Teak Furniture Item #98 (Model #198)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.8,
    "reviews": 44,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #98 (model #198) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 99,
    "name": "Wheel Solid Teak Bed (Model #199)",
    "category": "Bedroom",
    "price": 34000,
    "oldPrice": 42500,
    "rating": 4.9,
    "reviews": 51,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood wheel solid teak bed (model #199) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 100,
    "name": "Royal Carved 6-Seater Oval Dining Table (Model #200)",
    "category": "Dining",
    "price": 41000,
    "oldPrice": 51250,
    "rating": 5.0,
    "reviews": 58,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved 6-seater oval dining table (model #200) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 101,
    "name": "Chittagong Teak Heavy Wood Carved Sofa Set (Model #201)",
    "category": "Living Room",
    "price": 38000,
    "oldPrice": 47500,
    "rating": 4.6,
    "reviews": 65,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong teak heavy wood carved sofa set (model #201) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 102,
    "name": "Chittagong Segun Solid Wood Manager Table (Model #202)",
    "category": "Office",
    "price": 16300,
    "oldPrice": 20375,
    "rating": 4.7,
    "reviews": 72,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong segun solid wood manager table (model #202) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 103,
    "name": "Modern Horizontal Panel Segun Door (Model #203)",
    "category": "Doors",
    "price": 16500,
    "oldPrice": 20625,
    "rating": 4.8,
    "reviews": 79,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern horizontal panel segun door (model #203) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 104,
    "name": "Chittagong Teak 4-Door Glass Showcase Almirah (Model #204)",
    "category": "Almirah & Wardrobe",
    "price": 43500,
    "oldPrice": 54375,
    "rating": 4.9,
    "reviews": 21,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong teak 4-door glass showcase almirah (model #204) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 105,
    "name": "Solid Segun Teak Furniture Item #105 (Model #205)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 5.0,
    "reviews": 28,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #105 (model #205) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 106,
    "name": "Monarch Executive King Bed (Model #206)",
    "category": "Bedroom",
    "price": 22000,
    "oldPrice": 27500,
    "rating": 4.6,
    "reviews": 35,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood monarch executive king bed (model #206) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 107,
    "name": "Chittagong Teak 8-Chair Executive Dining Table (Model #207)",
    "category": "Dining",
    "price": 55000,
    "oldPrice": 68750,
    "rating": 4.7,
    "reviews": 42,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chittagong teak 8-chair executive dining table (model #207) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 108,
    "name": "Modern Scandinavian Fabric Sofa Set 3+2 (Model #208)",
    "category": "Living Room",
    "price": 55500,
    "oldPrice": 69375,
    "rating": 4.8,
    "reviews": 49,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern scandinavian fabric sofa set 3+2 (model #208) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 109,
    "name": "Royal Carved Heritage Executive Writing Desk (Model #209)",
    "category": "Office",
    "price": 28900,
    "oldPrice": 36125,
    "rating": 4.9,
    "reviews": 56,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved heritage executive writing desk (model #209) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 110,
    "name": "Waterproof Lacquer Polish Interior Bedroom Door (Model #210)",
    "category": "Doors",
    "price": 17500,
    "oldPrice": 21875,
    "rating": 5.0,
    "reviews": 63,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood waterproof lacquer polish interior bedroom door (model #210) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 111,
    "name": "Royal Carved 2-Door Segun Bedroom Almirah (Model #211)",
    "category": "Almirah & Wardrobe",
    "price": 40500,
    "oldPrice": 50625,
    "rating": 4.6,
    "reviews": 70,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved 2-door segun bedroom almirah (model #211) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 112,
    "name": "Solid Segun Teak Furniture Item #112 (Model #212)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.7,
    "reviews": 77,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #112 (model #212) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 113,
    "name": "Crown Royal Segun Teak Bed (Model #213)",
    "category": "Bedroom",
    "price": 32500,
    "oldPrice": 40625,
    "rating": 4.8,
    "reviews": 19,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood crown royal segun teak bed (model #213) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 114,
    "name": "Purley Luxury Marble-Top Dining Set (Model #214)",
    "category": "Dining",
    "price": 45000,
    "oldPrice": 56250,
    "rating": 4.9,
    "reviews": 26,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood purley luxury marble-top dining set (model #214) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 115,
    "name": "Chesterfield Genuine Leather 3-Seater Sofa (Model #215)",
    "category": "Living Room",
    "price": 48000,
    "oldPrice": 60000,
    "rating": 5.0,
    "reviews": 33,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood chesterfield genuine leather 3-seater sofa (model #215) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 116,
    "name": "Executive Boss Desk with Side Cabinet & Lock (Model #216)",
    "category": "Office",
    "price": 23500,
    "oldPrice": 29375,
    "rating": 4.6,
    "reviews": 40,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive boss desk with side cabinet & lock (model #216) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 117,
    "name": "CNC Deep Engraved Floral Teak Wooden Door (Model #217)",
    "category": "Doors",
    "price": 18500,
    "oldPrice": 23125,
    "rating": 4.7,
    "reviews": 47,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood cnc deep engraved floral teak wooden door (model #217) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 118,
    "name": "Modern Sliding Door Mirror Wardrobe Almirah (Model #218)",
    "category": "Almirah & Wardrobe",
    "price": 37500,
    "oldPrice": 46875,
    "rating": 4.8,
    "reviews": 54,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/exec-desk.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood modern sliding door mirror wardrobe almirah (model #218) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 119,
    "name": "Solid Segun Teak Furniture Item #119 (Model #219)",
    "category": "Reading & Study Desk",
    "price": 25200,
    "oldPrice": 31500,
    "rating": 4.9,
    "reviews": 61,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #119 (model #219) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 120,
    "name": "Imperial Luxury Velvet Headboard Bed (Model #220)",
    "category": "Bedroom",
    "price": 43000,
    "oldPrice": 53750,
    "rating": 5.0,
    "reviews": 68,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood imperial luxury velvet headboard bed (model #220) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 121,
    "name": "Beijing 6-Chair Solid Segun Dining Set (Model #221)",
    "category": "Dining",
    "price": 35000,
    "oldPrice": 43750,
    "rating": 4.6,
    "reviews": 75,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood beijing 6-chair solid segun dining set (model #221) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 122,
    "name": "Classic 3+1+1 Segun Carved Velvet Sofa (Model #222)",
    "category": "Living Room",
    "price": 40500,
    "oldPrice": 50625,
    "rating": 4.7,
    "reviews": 17,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood classic 3+1+1 segun carved velvet sofa (model #222) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 123,
    "name": "Ergonomic Dual Computer Workstation Desk (Model #223)",
    "category": "Office",
    "price": 18100,
    "oldPrice": 22625,
    "rating": 4.8,
    "reviews": 24,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood ergonomic dual computer workstation desk (model #223) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 124,
    "name": "Royal Carved Double Leaf Entrance Gate Door (Model #224)",
    "category": "Doors",
    "price": 19500,
    "oldPrice": 24375,
    "rating": 4.9,
    "reviews": 31,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal carved double leaf entrance gate door (model #224) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 125,
    "name": "Heritage Teak 3-Drawer Dressing Almirah (Model #225)",
    "category": "Almirah & Wardrobe",
    "price": 34500,
    "oldPrice": 43125,
    "rating": 5.0,
    "reviews": 38,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood heritage teak 3-drawer dressing almirah (model #225) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 126,
    "name": "Solid Segun Teak Furniture Item #126 (Model #226)",
    "category": "Reading & Study Desk",
    "price": 33600,
    "oldPrice": 42000,
    "rating": 4.6,
    "reviews": 45,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood solid segun teak furniture item #126 (model #226) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 127,
    "name": "Royal Windsor Heavy Wood Bed (Model #227)",
    "category": "Bedroom",
    "price": 31000,
    "oldPrice": 38750,
    "rating": 4.7,
    "reviews": 52,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg",
    "badge": "Solid Segun",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood royal windsor heavy wood bed (model #227) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  },
  {
    "id": 128,
    "name": "Executive Office Meeting & Dining Desk (Model #228)",
    "category": "Dining",
    "price": 49000,
    "oldPrice": 61250,
    "rating": 4.8,
    "reviews": 59,
    "image": "https://haatfurniture.com/wp-content/uploads/2023/03/sofa-1.jpg",
    "badge": "20 Yrs Warranty",
    "description": "Handcrafted 100% genuine Chittagong Segun teak wood executive office meeting & dining desk (model #228) with 20-year anti-borer & termite proof guarantee. Safe delivery in Dhaka City."
  }
];

export default function AllProductsPage() {
  const [products, setProducts] = useState(all128ProductsCatalog);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Load products from API or local fallback
  useEffect(() => {
    fetch("/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        setProducts(all128ProductsCatalog);
      });
  }, []);

  // Sync Cart with localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("haat_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("haat_cart", JSON.stringify(newCart));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    saveCart(newCart);
    showToast(`🛒 "${product.name}" কার্টে যোগ করা হয়েছে!`);
  };

  const updateQuantity = (id, delta) => {
    const newCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    saveCart(newCart);
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Filter & Sort Products
  let filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "low-to-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high-to-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce font-semibold text-sm">
          <span className="text-lg">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP THIN NOTIFICATION RIBBON */}
      <div className="bg-[#f8f6f0] text-slate-700 text-xs py-2.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-slate-200/80 relative z-50">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-extrabold text-slate-900 tracking-wide">
            HAAT FURNITURE LIMITED — Complete Authentic 128 Products Segun Catalog
          </span>
          <span className="hidden lg:inline-block px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase tracking-wider">
            20 Yrs Warranty
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-slate-600 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-600">📍</span>
            <span>Showrooms: Badda & Mirpur, Dhaka</span>
          </span>
          <span className="text-slate-300">•</span>
          <a href="tel:+8809617333990" className="flex items-center gap-1.5 font-extrabold text-amber-700 hover:text-amber-800 transition-colors">
            <span>📞 Hotline:</span>
            <span>+8809617333990</span>
          </a>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl text-slate-900 border-b border-slate-200/90 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-6">
          
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="px-2.5 py-1 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg"
                alt="HAAT FURNITURE Logo"
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider">
            <Link href="/" className="text-slate-700 hover:text-amber-600 transition-colors flex items-center gap-1">
              <span>←</span> Back to Home
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-amber-600 font-extrabold">All 128 Products ({filteredProducts.length} Items)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 transition-all flex items-center gap-2 group hover:border-amber-500/50"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">🛒</span>
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center font-black shadow-sm">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              <span className="hidden xl:inline-block text-xs font-bold text-emerald-600 ml-0.5">
                ৳ {totalCartPrice.toLocaleString()}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* BANNER & SEARCH BAR */}
      <section className="py-12 bg-gradient-to-b from-[#f8f6f0] to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-md">
            ✨ Complete Solid Chittagong Segun Collection (128 Items)
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            All 128 Authentic Furniture Items
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
            Explore our complete database catalog of 128 genuine Chittagong Segun teak wood beds, wardrobes, almirahs, dining table suites, sectional sofas, security doors, and executive office desks.
          </p>

          {/* SEARCH & FILTER TOOLBAR */}
          <div className="max-w-3xl mx-auto pt-4 flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search across all 128 products (যেমন: Bed, Sofa, Dining, Almirah)..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm transition-all"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-900">✕</button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm cursor-pointer"
              >
                <option value="default">Sort by: Featured</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="rating">Highest Rated ★</option>
              </select>
            </div>

          </div>

          {/* CATEGORY PILL FILTER */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { name: "All Furniture (128)", slug: "all" },
              { name: "Bedroom", slug: "bedroom" },
              { name: "Dining", slug: "dining" },
              { name: "Living Room", slug: "living" },
              { name: "Almirah & Wardrobe", slug: "almirah" },
              { name: "Office", slug: "office" },
              { name: "Doors", slug: "door" }
            ].map((tab, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedCategory(tab.slug); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all hover:scale-105 ${
                  selectedCategory === tab.slug
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* PRODUCTS GRID SECTION */}
      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <span className="text-6xl inline-block animate-bounce">🔍</span>
              <h3 className="text-xl font-black text-slate-900">No furniture found matching "{searchQuery}"</h3>
              <p className="text-xs text-slate-500">Try searching for different keywords like Bed, Sofa, Dining, or Almirah.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setCurrentPage(1); }}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-extrabold shadow-md hover:bg-slate-800"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group rounded-3xl bg-white border border-slate-200/90 p-4 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Badge & Category */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-wider">
                        {product.category || 'Solid Segun'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                        20 Yrs Warranty
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-48 sm:h-52 flex items-center justify-center overflow-hidden my-2 relative rounded-2xl bg-slate-50/50 p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80";
                        }}
                      />

                      {/* Quick View Button on Image Hover */}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black gap-1.5"
                      >
                        <span>🔍 Quick View</span>
                      </button>
                    </div>

                    {/* Product Information */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                        <span>★ {product.rating || 4.9}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">({product.reviews || 24} reviews)</span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-base font-black text-emerald-600">৳ {product.price?.toLocaleString()}</span>
                          {product.oldPrice && (
                            <span className="text-xs text-slate-400 line-through ml-2">৳ {product.oldPrice?.toLocaleString()}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">BDT</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black transition-all flex items-center justify-center gap-1"
                        >
                          <span>🛒 Cart</span>
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product);
                            window.location.href = "/checkout";
                          }}
                          className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-md shadow-red-600/30 flex items-center justify-center gap-1 hover:scale-102"
                        >
                          <span>⚡ Order</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-8 border-t border-slate-200">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    ‹ Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => { setCurrentPage(pg); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                        currentPage === pg
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* CART DRAWER MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md animate-entrance">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>🛍️</span> Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center">
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <span className="text-5xl animate-bounce inline-block">🛍️</span>
                  <p className="text-sm font-bold text-slate-700">Your cart is currently empty</p>
                  <button onClick={() => setIsCartOpen(false)} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold shadow-md">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-200 p-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-xs text-emerald-600 font-bold mt-0.5">৳ {item.price?.toLocaleString()} BDT</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300">-</button>
                          <span className="text-xs font-extrabold text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300">+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-600 text-xs p-1 font-bold">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-black">৳ {totalCartPrice.toLocaleString()} BDT</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all text-center block shadow-lg shadow-red-600/30 uppercase tracking-wider"
                >
                  ⚡ Proceed to Express Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-entrance">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-slate-800">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 font-bold flex items-center justify-center"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-64 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-center">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                  {quickViewProduct.category}
                </span>

                <h3 className="text-xl font-black text-slate-900">{quickViewProduct.name}</h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="text-2xl font-black text-emerald-600">
                  ৳ {quickViewProduct.price?.toLocaleString()} BDT
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md"
                  >
                    🛒 Add to Cart
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => addToCart(quickViewProduct)}
                    className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black text-center shadow-md"
                  >
                    ⚡ Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-2">
          <p>© {new Date().getFullYear()} Haat Furniture Limited | All rights reserved | Design & Development By —{' '}
            <a href="https://shoeb-devops.github.io" target="_blank" rel="noreferrer" className="text-amber-400 font-extrabold hover:underline">
              shoeb-devops.github.io
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
