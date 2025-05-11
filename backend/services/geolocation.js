const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const getNearbyHospitals = async (latitude, longitude, options = {}) => {
  const {
    radius = 5000,
    type = "hospital",
    minRating = 0,
    openNow = false,
    pageToken = null,
  } = options;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Cache key for current query
  const cacheKey = `${latitude}_${longitude}_${radius}_${type}_${minRating}_${openNow}_${pageToken}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("✅ Returning cached data");
    return cachedData;
  }

  try {
    let url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

    if (minRating) url += `&minprice=${minRating}`;
    if (openNow) url += `&opennow=true`;
    if (pageToken) url += `&pagetoken=${pageToken}`;

    const response = await axios.get(url);
    const { results, next_page_token } = response.data;

    if (!results || results.length === 0) {
      throw new Error("No hospitals found nearby.");
    }

    // Filter and sort hospitals
    const hospitals = results
      .filter((hospital) => hospital.rating >= minRating)
      .map((hospital) => ({
        id: hospital.place_id,
        name: hospital.name,
        address: hospital.vicinity,
        rating: hospital.rating || "Not available",
        openNow: hospital.opening_hours?.open_now || false,
        location: hospital.geometry.location,
        types: hospital.types || [],
        distance: calculateDistance(
          latitude,
          longitude,
          hospital.geometry.location.lat,
          hospital.geometry.location.lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance || b.rating - a.rating); // Sort by distance, then by rating

    // ✅ Cache the result
    cache.set(cacheKey, { hospitals, nextPageToken: next_page_token });

    return { hospitals, nextPageToken: next_page_token };
  } catch (error) {
    console.error("❌ Failed to fetch nearby hospitals:", error.message);
    throw new Error("Failed to fetch nearby hospitals");
  }
};

// ✅ Function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// ✅ Function to get detailed hospital information
const getHospitalDetails = async (placeId) => {
  const cacheKey = `hospital_details_${placeId}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("✅ Returning cached hospital details");
    return cachedData;
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    const response = await axios.get(url);
    const hospital = response.data.result;

    if (!hospital) throw new Error("Hospital details not found");

    const detailedInfo = {
      id: hospital.place_id,
      name: hospital.name,
      address: hospital.formatted_address,
      phoneNumber: hospital.formatted_phone_number || "Not available",
      website: hospital.website || "Not available",
      rating: hospital.rating || "Not available",
      openNow: hospital.opening_hours?.open_now || false,
      types: hospital.types || [],
      operatingHours: hospital.opening_hours?.weekday_text || [],
      location: hospital.geometry.location,
      reviews:
        hospital.reviews?.map((review) => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: new Date(review.time * 1000).toLocaleString(),
        })) || [],
    };

    // ✅ Cache result for 10 minutes
    cache.set(cacheKey, detailedInfo, 600);

    return detailedInfo;
  } catch (error) {
    console.error("❌ Failed to fetch hospital details:", error.message);
    throw new Error("Failed to fetch hospital details");
  }
};

module.exports = {
  getNearbyHospitals,
  getHospitalDetails,
};
