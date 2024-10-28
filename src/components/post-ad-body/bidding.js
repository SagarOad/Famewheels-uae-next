import React, { useState, useEffect, useContext, forwardRef } from "react";
import PostPhotos from "@/images/post-photos.png";
import Redtick from "@/images/Red_tick.png";
import ClearIcon from "@mui/icons-material/Clear";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import MuiAlert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modal, Box, Button, Snackbar } from "@mui/material";
import TimerLoader from "@/images/timer.gif";
import InputMask from "react-input-mask";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import s3 from "@/config/s3Config";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const successModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  minHeight: "10%",
  maxHeight: "95%",
  height: "auto",
  overflowY: "scroll",
};

export default function BiddingPostAd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useContext(AuthContext);

  const url = window.location.href;

  const [postToken, setPostToken] = useState(null);

  useEffect(() => {
    const generateToken = () => {
      const newToken = uuidv4().replace(/-/g, "").slice(0, 12);
      setPostToken(newToken);
    };

    generateToken();
  }, []);

  const extractTypeFromUrl = (url) => {
    const parts = url.split("post-ad?");
    return parts.length > 1 ? parts[parts.length - 1] : null;
  };
  const searchCategory = extractTypeFromUrl(url);

  const extractPostIdFromUrl = (url) => {
    const parts = url.split("post-ad/");
    return parts.length > 1 ? parts[parts.length - 1] : null;
  };
  const postRouteId = extractPostIdFromUrl(url);

  const [abs, setABS] = useState(false);
  const [airbags, setAirBags] = useState(false);
  const [airconditioning, setAirConditioning] = useState(false);
  const [fm, setFM] = useState(false);
  const [cassettePlayer, setCassettePlayer] = useState(false);
  const [cdPlayer, setCDPlayer] = useState(false);
  const [dvdPlayer, setDVDPlayer] = useState(false);
  const [climateControl, setClimateControl] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [frontSpeakers, setFrontSpeakers] = useState(false);
  const [heatedSeats, setHeatedSeats] = useState(false);
  const [immobilizerKey, setImmobilizerKey] = useState(false);
  const [keylessEntry, setKeylessEntry] = useState(false);
  const [navigationSystem, setNavigationSystem] = useState(false);
  const [powerLocks, setPowerLocks] = useState(false);
  const [powerMirrors, setPowerMirrors] = useState(false);
  const [powerSteering, setPowerSteering] = useState(false);
  const [powerWindows, setPowerWindows] = useState(false);
  const [rearACVents, setRearACVents] = useState(false);
  const [rearCamera, setRearCamera] = useState(false);
  const [rearSeatEntertainment, setRearSeatEntertainment] = useState(false);
  const [rearSpeakers, setRearSpeakers] = useState(false);
  const [steeringSwitches, setSteeringSwitches] = useState(false);
  const [sunRoof, setSunRoof] = useState(false);
  const [usb, setUSB] = useState(false);
  const [alloyRims, setAlloyRims] = useState(false);
  const [assembly, setAssembly] = useState("Local");
  const [importYear, setImportYear] = useState("");

  const [cityName, setCityName] = useState("");
  const [vehicleColour, setVehicleColour] = useState("");
  const [milage, setMilage] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [description, setDescription] = useState("");
  const [makeName, setMakeName] = useState("");
  const [modelName, setModelName] = useState("");
  const [yearName, setYearName] = useState("");
  const [variant, setVariant] = useState("");
  const [registeredIn, setRegisteredIn] = useState("");
  const [registrationYear, setRegistrationYear] = useState("");

  const [transmission, setTransmission] = useState("");
  const [vehicleCondition, setVehicleCondition] = useState("");
  const [vehicleFuel, setVehicleFuel] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [userName, setUserName] = useState("");
  const [images, setImages] = useState([]);
  const [prevImage, setPrevImage] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [routeId, setRouteId] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesPath, setImagesPath] = useState("");
  const token = localStorage.getItem("token");

  const [error, setError] = useState("");
  const [postError, setPostError] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [imageApi, setImageApi] = useState(true);

  const postDisabled = imageApi === false;

  useEffect(() => {
    const type =
      searchCategory === "Free-Ads"
        ? "Free Ads"
        : searchCategory === "Featured-Ads"
        ? "Featured Ads"
        : searchCategory === "Auction-Ads"
        ? "Auction Ads"
        : searchCategory === "Sell-to-fameWheels"
        ? "Sell to fameWheels"
        : "";
    const replicafetchData = localStorage.getItem("data");
    const fetchData = JSON.parse(replicafetchData);
    setUserName(fetchData && fetchData.sub);
    setTypeName(type);
  }, [searchCategory]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        cityName ||
        vehicleColour ||
        milage ||
        price ||
        phone ||
        description ||
        makeName ||
        modelName ||
        yearName ||
        registeredIn ||
        transmission ||
        assembly ||
        vehicleCondition ||
        vehicleFuel ||
        categoryName ||
        userName ||
        images.length > 0
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    cityName,
    vehicleColour,
    milage,
    price,
    phone,
    description,
    makeName,
    modelName,
    yearName,
    registeredIn,
    transmission,
    vehicleCondition,
    vehicleFuel,
    categoryName,
    assembly,
    userName,
    images,
  ]);

  const [vehicleCategory, setVehicleCategory] = useState(null);
  const [cities, setCities] = useState(null);
  const [make, setMake] = useState(null);
  const [getModel, setGetModel] = useState(null);
  const [makeId, setMakeId] = useState("");
  const [modelYear, setModelYear] = useState(null);
  const [variantList, setVariantList] = useState([]);
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cities`);

        setCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCity();
  }, []);

  useEffect(() => {
    const fetchMake = async () => {
      try {
        const response = await axios.get(`${baseUrl}/byMake`);

        setMake(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMake();
  }, []);

  const handleMakeChange = (e) => {
    const selectedMake = make.find((item) => item.makeName === e.target.value);
    if (selectedMake) {
      setMakeId(selectedMake.makeId);
    } else {
      setMakeId("");
    }
    setMakeName(e.target.value);
  };

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(`${baseUrl}/model-by-make`, {
          params: {
            make_id: makeId,
          },
        });

        setGetModel(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (makeId) {
      fetchModel();
    } else {
      setGetModel([]);
    }
  }, [makeId]);

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getModelYear`);

        setModelYear(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchYear();
  }, []);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getVarient`, {
          params: {
            variant_id: variant,
          },
        });

        setVehicleFuel(response.data?.engine_type);
        setAssembly(response.data?.assembly);
        setCategoryName(response.data?.engine_capacity);
        setABS(response.data?.abs);
        setCassettePlayer(response.data?.cassette_player);
        setTransmission(response.data?.transmission);
        setAirConditioning(response.data?.air_conditioning);
        setAirBags(response.data?.air_bags);
        setFM(response.data?.am_fm_radio);
        setCassettePlayer(response.data?.cassette_player);
        setCDPlayer(response.data?.cd_player);
        setDVDPlayer(response.data?.dvd_player);
        setClimateControl(response.data?.climate_control);
        setFrontCamera(response.data?.front_camera);
        setFrontSpeakers(response.data?.front_speakers);
        setHeatedSeats(response.data?.heated_seats);
        setImmobilizerKey(response.data?.immobilizer_key);
        setKeylessEntry(response.data?.keyless_entry);
        setNavigationSystem(response.data?.navigation_system);
        setPowerLocks(response.data?.power_locks);
        setPowerMirrors(response.data?.power_mirrors);
        setPowerSteering(response.data?.power_steering);
        setPowerWindows(response.data?.power_windows);
        setRearACVents(response.data?.rear_ac_vents);
        setRearCamera(response.data?.rear_camera);
        setRearCamera(response.data?.rear_camera);
        setRearSeatEntertainment(response.data?.rear_seat_entertainment);
        setRearSpeakers(response.data?.rear_speakers);
        setSteeringSwitches(response.data?.steering_switches);
        setSteeringSwitches(response.data?.steering_switches);
        setSunRoof(response.data?.sun_roof);
        setUSB(response.data?.usb_and_auxillary_cable);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (variant) {
      fetchFeatures();
    } else if (variantList.length === 0) {
      setABS(false);
      setCassettePlayer(false);
      setTransmission(false);
      setAirConditioning(false);
      setAirBags(false);
      setFM(false);
      setCassettePlayer(false);
      setCDPlayer(false);
      setDVDPlayer(false);
      setClimateControl(false);
      setFrontCamera(false);
      setFrontSpeakers(false);
      setHeatedSeats(false);
      setImmobilizerKey(false);
      setKeylessEntry(false);
      setNavigationSystem(false);
      setPowerLocks(false);
      setPowerMirrors(false);
      setPowerSteering(false);
      setPowerWindows(false);
      setRearACVents(false);
      setRearCamera(false);
      setRearCamera(false);
      setRearSeatEntertainment(false);
      setRearSpeakers(false);
      setSteeringSwitches(false);
      setSteeringSwitches(false);
      setSunRoof(false);
      setUSB(false);
    } else {
    }
  }, [modelName, variant, variantList.length, yearName]);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getVarientList`, {
          params: {
            modelId: modelName,
            yearId: yearName,
          },
        });

        setVariantList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (yearName) {
      fetchVariant();
    } else {
      setVariantList([]);
    }
  }, [modelName, yearName]);

  const history = useRouter();

  const AdSubmit = async (e) => {
    e.preventDefault();
    if (makeId === "") {
      return setPostError("Make is missing"), setPostErrorOpen(true);
    } else if (modelName === "") {
      return setPostError("Model is missing"), setPostErrorOpen(true);
    } else if (yearName === "") {
      return setPostError("Year is missing"), setPostErrorOpen(true);
    } else if (variant === "") {
      return setPostError("Vriant is missing"), setPostErrorOpen(true);
    } else if (registeredIn === "") {
      return setPostError("Registered In is missing"), setPostErrorOpen(true);
    } else if (transmission === "") {
      return setPostError("Transmission In is missing"), setPostErrorOpen(true);
    } else if (assembly === "") {
      return setPostError("Assembly In is missing"), setPostErrorOpen(true);
    } else if (vehicleColour === "") {
      return (
        setPostError("Vehicle Colour In is missing"), setPostErrorOpen(true)
      );
    } else if (cityName === "") {
      return setPostError("City is missing"), setPostErrorOpen(true);
    } else if (milage === "") {
      return setPostError("Milage is missing"), setPostErrorOpen(true);
    } else if (vehicleFuel === "") {
      return setPostError("Vehicle Fuel is missing"), setPostErrorOpen(true);
    } else if (categoryName === "") {
      return setPostError("Engine Size is missing"), setPostErrorOpen(true);
    } else if (price === "") {
      return setPostError("Price is missing"), setPostErrorOpen(true);
    } else if (description === "") {
      return setPostError("Description missing"), setPostErrorOpen(true);
    } else if (
      (!postRouteId && uploadedImages?.length < 1) ||
      (postRouteId && vehicleImages?.length < 1)
    ) {
      return (
        setPostError("At least one image must be uploaded"),
        setPostErrorOpen(true)
      );
    } else if (!postRouteId && coverImage === "") {
      return setPostError("Select cover image"), setPostErrorOpen(true);
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      // Append form field values
      formData.append(
        "carFeatures",
        JSON.stringify({
          abs: abs,
          air_bags: airbags,
          air_conditioning: airconditioning,
          am_fm_radio: fm,
          cassette_player: cassettePlayer,
          cd_player: cdPlayer,
          climate_control: climateControl,
          front_camera: frontCamera,
          front_speakers: frontSpeakers,
          heated_seats: heatedSeats,
          immobilizer_key: immobilizerKey,
          keyless_entry: keylessEntry,
          navigation_system: navigationSystem,
          power_locks: powerLocks,
          power_mirrors: powerMirrors,
          power_steering: powerSteering,
          power_windows: powerWindows,
          rear_ac_vents: rearACVents,
          rear_camera: rearCamera,
          rear_seat_entertainment: rearSeatEntertainment,
          rear_speakers: rearSpeakers,
          steering_switches: steeringSwitches,
          sun_roof: sunRoof,
          usb_and_auxillary_cable: usb,
          alloy_rims: alloyRims,
        })
      );
      formData.append("title", "Auction Post");
      formData.append("cityName", cityName);
      formData.append("vehicleColour", vehicleColour);
      formData.append("milage", milage);
      formData.append("price", price);
      formData.append("phone", phone);
      formData.append("description", description);
      formData.append("makeName", makeId);
      formData.append("modelName", modelName);
      formData.append("yearName", yearName);
      formData.append("registeredIn", registeredIn);
      formData.append("registration_year", registrationYear);
      formData.append("import_year", importYear);
      formData.append("transmission", transmission);
      formData.append("assembly", assembly);
      formData.append("vehicleCondition", "used");
      formData.append("vehicleFuel", vehicleFuel);
      formData.append("variant_id", variant);
      formData.append("newcarpost_cover", coverImage);

      formData.append("engineCapacity", categoryName);
      formData.append("typeName", typeName || "");
      formData.append("user_id", user?.id);
      formData.append(`post_token`, postToken);
      formData.append(`post_type_id`, 3);

      uploadedImages.forEach((image) => {
        formData.append(`imageFiles[]`, image);
      });

      if (routeId) {
        formData.append("status", 2);

        const response = await axios.post(`${baseUrl}/updatepost`, formData, {
          params: {
            post_id: postRouteId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setOpenSuccessModal(true);
        setIsSubmitting(false);

        setTimeout(() => {
          setOpenSuccessModal(false);
          history.push("/pending-ads");
        }, 3000);
      } else {
        const response = await axios.post(`${baseUrl}/savepost`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setOpenSuccessModal(true);
        setIsSubmitting(false);

        setTimeout(() => {
          setOpenSuccessModal(false);
          history.push("/");
        }, 3000);
      }
    } catch (err) {
      setError(err?.response?.data);
      setPostError(err?.response?.data);
      setPostErrorOpen(true);
      setIsSubmitting(false);
    }
  };

  const [dragging, setDragging] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const formatPrice = (price) => {
    if (price >= 100000000000) {
      return (
        (price / 100000000000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + " Kharab"
      );
    } else if (price >= 1000000000) {
      return (
        (price / 1000000000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + " Arab"
      );
    } else if (price >= 10000000) {
      return (
        (price / 10000000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + " Crore"
      );
    } else if (price >= 100000) {
      return (
        (price / 100000).toLocaleString("en-US", { maximumFractionDigits: 2 }) +
        " lacs"
      );
    } else if (price >= 1000) {
      return (
        (price / 1000).toLocaleString("en-US", { maximumFractionDigits: 2 }) +
        " Thousand"
      );
    } else {
      return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setImageApi(false);
    const uploadedImages = [];
    if (images.length + files.length > 20) {
      setImageErrorMessage("Maximum number of images exceeded!");
      setOpen(true);
      return;
    }

    files.forEach((file) => {
      setPrevImage((prevImage) => [...prevImage, file]);
      if (file.size <= 20 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            const imageSrc = reader.result;
            if (images.length < 20 && !images.includes(imageSrc)) {
              uploadedImages.push(imageSrc);
              setImages((prevImages) => [...prevImages, imageSrc]);
              setImageErrorMessage("");
            } else if (images.includes(imageSrc)) {
              setImageErrorMessage("Duplicate image detected!");
              setOpen(true);
            } else if (images.length > 20) {
              setImageErrorMessage("Maximum number of images exceeded!");
              setOpen(true);
            } else {
              setImageErrorMessage("File size limit exceeded (20MB)!");
              setOpen(true);
            }
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageErrorMessage("File size limit exceeded (20MB)!");
        setOpen(true);
      }
    });
    for (const image of files) {
      try {
        const s3Key = `public/posts/${postToken}/${image?.name}`;

        const params = {
          Bucket: "famewheels",
          Key: s3Key,
          Body: image,
          // ACL: 'public-read', // Or the appropriate ACL
          ContentType: image?.type,
        };

        const responseS3 = await s3.upload(params).promise();
        const url = responseS3.Key;
        const ImageName = url.substring(url.lastIndexOf("/") + 1);

        const formData = new FormData();
        formData.append("imagesList", null);
        formData.append(`post_token`, postToken);

        formData.append(`file`, image?.name);

        const response = await axios.post(
          `${baseUrl}/savesinglepostimage`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUploadedImages((prevImages) => [
          ...prevImages,
          ...response.data.adds,
        ]);
        setImagesPath(response.data.imagepath);
        setImageApi(true);
      } catch (error) {
        console.error("image upload Error:", error);
        setImageErrorMessage("Something went wrong.");
      }
    }
  };

  const handleImageDelete = (index, e) => {
    e.preventDefault();
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    uploadedImages.splice(index + 1, 1);
    setUploadedImages(uploadedImages);

    if (newImages.length === 0) {
      setImageErrorMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const uploadedImages = [];

    files.forEach((file) => {
      if (file.size <= 20 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            const imageSrc = reader.result;
            if (images.length < 20 && !images.includes(imageSrc)) {
              uploadedImages.push(imageSrc);
              setImages((prevImages) => [...prevImages, imageSrc]);
              setImageErrorMessage("");
            } else if (images.includes(imageSrc)) {
              setImageErrorMessage("Duplicate image detected!");
              setOpen(true);
            } else {
              setImageErrorMessage("Maximum number of images exceeded!");
              setOpen(true);
            }
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageErrorMessage("File size limit exceeded (20MB)!");
        setOpen(true);
      }
    });
  };

  const [vehicleImages, setVehicleImages] = useState(null);
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${baseUrl}/postimages`, {
        params: {
          post_id: postRouteId,
        },
      });

      setVehicleImages(response?.data?.images);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (postRouteId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${baseUrl}/vehicle-details`, {
            params: {
              post_id: postRouteId,
              userId: user?.id,
            },
          });

          const {
            city_id,
            vehicle_colour,
            milage,
            price,
            phone,
            description,
            makeName,
            make_id,
            model_id,
            year_id,
            registered_in,
            transmission,
            assembly,

            vehicleCondition,
            vehicle_fuel,
            categoryName,
            userName,
            post_id,
            variant_id,
            engine_capacity,
            car_features,
            registration_year,
            import_year,
          } = response.data;
          setCityName(city_id);
          setVehicleColour(vehicle_colour);
          setMilage(milage);
          setPrice(price);
          setPhone(phone);
          setDescription(description);
          setMakeName(makeName);
          setMakeId(make_id);
          setModelName(model_id);
          setYearName(year_id);
          setRegisteredIn(registered_in);
          setRegistrationYear(registration_year);
          setImportYear(import_year);
          setTransmission(transmission);
          setAssembly(assembly);
          setVehicleCondition(vehicleCondition);
          setVehicleFuel(vehicle_fuel);
          setCategoryName(categoryName);
          setUserName(userName);
          setRouteId(post_id);
          setVariant(variant_id);
          const carFeatures = JSON.parse(car_features);

          setVehicleFuel(carFeatures?.vehicle_fuel);
          setCategoryName(engine_capacity || carFeatures?.engine_capacity);
          setABS(carFeatures?.abs);
          setCassettePlayer(carFeatures?.cassette_player);
          setTransmission(carFeatures?.transmission);
          setAirConditioning(carFeatures?.air_conditioning);
          setAirBags(carFeatures?.air_bags);
          setFM(carFeatures?.am_fm_radio);
          setCassettePlayer(carFeatures?.cassette_player);
          setCDPlayer(carFeatures?.cd_player);
          setDVDPlayer(carFeatures?.dvd_player);
          setClimateControl(carFeatures?.climate_control);
          setFrontCamera(carFeatures?.front_camera);
          setFrontSpeakers(carFeatures?.front_speakers);
          setHeatedSeats(carFeatures?.heated_seats);
          setImmobilizerKey(carFeatures?.immobilizer_key);
          setKeylessEntry(carFeatures?.keyless_entry);
          setNavigationSystem(carFeatures?.navigation_system);
          setPowerLocks(carFeatures?.power_locks);
          setPowerMirrors(carFeatures?.power_mirrors);
          setPowerSteering(carFeatures?.power_steering);
          setPowerWindows(carFeatures?.power_windows);
          setRearACVents(carFeatures?.rear_ac_vents);
          setRearCamera(carFeatures?.rear_camera);
          setRearCamera(carFeatures?.rear_camera);
          setRearSeatEntertainment(carFeatures?.rear_seat_entertainment);
          setRearSpeakers(carFeatures?.rear_speakers);
          setSteeringSwitches(carFeatures?.steering_switches);
          setSteeringSwitches(carFeatures?.steering_switches);
          setSunRoof(carFeatures?.sun_roof);
          setUSB(carFeatures?.usb_and_auxillary_cable);

          const fetchData = async () => {
            try {
              const response = await axios.get(`${baseUrl}/bycategory`);

              setVehicleCategory(response.data);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };

          fetchData();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();

      const fetchImages = async () => {
        try {
          const response = await axios.get(`${baseUrl}/postimages`, {
            params: {
              post_id: postRouteId,
            },
          });

          setVehicleImages(response?.data?.images);
          setImagesPath(response?.data?.imagepath);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchImages();
    }
  }, [postRouteId]);

  const updateImageDelete = async (index, image) => {
    try {
      await axios.delete(`${baseUrl}/deleteImages`, {
        params: {
          user_id: user?.id,
          post_id: postRouteId,
          filename: image,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchImages();
      setImageApi(true);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const [postErrOpen, setPostErrorOpen] = React.useState(false);

  const handlePostClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setPostErrorOpen(false);
  };

  const openTerms = () => {
    window.open(
      "https://gallery.famewheels.com/FamewheelAuctionTerms&Condition.pdf"
    );
  };
  return (
    <>
      <Snackbar
        open={postErrOpen}
        autoHideDuration={6000}
        onClose={handleBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handlePostClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {postError}
        </Alert>
      </Snackbar>
      <div>
        <div className="container mb-5">
          <div className="postInform p-5">
            <div className="text-center">
              <h4>Vehicle Information</h4>
              <h6>(All fields marked with * are mandatory)</h6>
            </div>
            <form onSubmit={AdSubmit} className="postAdForm">
              {error && <p>{error}</p>}

              <div
                className={`dropzone text-center my-5 ${
                  dragging ? "dragging" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div>
                  <img src={PostPhotos} alt="car image" srcSet={PostPhotos} />
                </div>
                <Button
                  variant="text"
                  component="label"
                  className="vehcileImages_uploadBtn"
                  sx={{ textTransform: "capitalize" }}
                >
                  <AddAPhotoIcon className="me-2" /> Add Photos
                  <input
                    name="vehicleImages"
                    hidden
                    className="form-control"
                    id="vehicleImages"
                    accept=".jpg,.jpeg,.png,"
                    multiple
                    onChange={handleImageUpload}
                    type="file"
                  />
                </Button>
                <p className="vImgLimit">(Max limit 20 MB per image)</p>
                <p className="dropHere">
                  {" "}
                  <AddIcon sx={{ fontSize: 40 }} /> Drop here
                </p>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleBarClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    onClose={handleBarClose}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    {imageErrorMessage}
                  </Alert>
                </Snackbar>
                <div className="previewMain">
                  {images.map((image, index) => (
                    <div key={index} className="vehicleImagePreview">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button
                        className="btn"
                        onClick={(e) => handleImageDelete(index, e)}
                      >
                        <ClearIcon sx={{ color: "#ffffff", fontSize: 18 }} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="previewMain">
                  {vehicleImages &&
                    vehicleImages?.images.map((image, index) => (
                      <div key={index} className="vehicleImagePreview">
                        <img
                          src={`${imagesPath}/${image?.filename}`}
                          alt={`Preview ${index + 1}`}
                        />
                        <button
                          className="btn"
                          type="submit"
                          onClick={() =>
                            updateImageDelete(index, image?.filename)
                          }
                        >
                          <ClearIcon sx={{ color: "#ffffff", fontSize: 18 }} />
                        </button>
                      </div>
                    ))}
                </div>
                <div className="row pt-5 d-none d-md-flex ">
                  <div className="col-lg-4 col-12 uploadImage_inst">
                    <img src={Redtick} alt="tick" srcSet={Redtick} />
                    <p>
                      Adding at least 8 pictures improves the chances for a
                      quick sale.
                    </p>
                  </div>
                  <div className="col-lg-4 col-12 uploadImage_inst">
                    <img src={Redtick} alt="tick" srcSet={Redtick} />
                    <p>
                      Adding clear Front, Back and Interior pictures of your car
                      increases the quality of your Ad and gets you noticed
                      more.
                    </p>
                  </div>
                  <div className="col-lg-4 col-12 uploadImage_inst">
                    <img src={Redtick} alt="tick" srcSet={Redtick} />
                    <p>Photos should be in 'jpeg, jpg, png' format only.</p>
                  </div>
                </div>
                {uploadedImages?.length > 0 && <h5>Select Cover Image</h5>}

                <div className="previewMain">
                  {uploadedImages &&
                    uploadedImages?.map((image, index) => (
                      <div
                        key={index}
                        className="vehicleImagePreviewCover form-check form-check-inline md-radioStyle p-0"
                      >
                        <input
                          id={`coverImage${index}`}
                          name="coverImage"
                          type="radio"
                          className="border-2 border-gray-200 outline-red-500 w-full p-1 rounded text-sm form-check-input radio-input"
                          onChange={() => setCoverImage(image)}
                        />
                        <label
                          className="form-check-label radio-label"
                          htmlFor={`coverImage${index}`}
                        >
                          <img
                            src={`${imagesPath}/${postToken}/${image}`}
                            alt={`Preview ${index + 1}`}
                          />
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-lg-3 col-md-6 col-12">
                  <div className="mb-3">
                    <label for="vehicleMake" className="form-label">
                      Select Make
                    </label>
                    <select
                      className="form-select"
                      id="vehicleMake"
                      aria-label="Default select example"
                      required
                      value={makeName}
                      onChange={handleMakeChange}
                    >
                      <option selected value=" ">
                        Select Make
                      </option>
                      {make &&
                        make.map((item) => (
                          <option key={item.makeId} value={item.makeName}>
                            {item.makeName}
                          </option>
                        ))}
                    </select>
                    <div id="CityHelp" className="form-text">
                      Mention your vehicle's make (e.g. Honda)
                    </div>
                  </div>
                </div>
                {makeName !== " " && (
                  <div className="col-lg-3 col-md-6 col-12">
                    {makeId && getModel.length > 0 ? (
                      <div className="mb-3">
                        <label for="vehicleModel" className="form-label">
                          Model
                        </label>
                        <select
                          className="form-select"
                          id="vehicleModel"
                          aria-label="Default select example"
                          required
                          value={modelName}
                          onChange={(e) => setModelName(e.target.value)}
                        >
                          <option selected value=" ">
                            Select {makeName && makeName} Model
                          </option>
                          {getModel &&
                            getModel.map((item) => (
                              <option key={item.modelId} value={item.modelId}>
                                {item.modelName}
                              </option>
                            ))}
                        </select>

                        <div id="CityHelp" className="form-text">
                          Mention your vehicle's Model (e.g. Civic)
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label for="vehicleModel" className="form-label">
                          Model
                        </label>
                        <select
                          className="form-select border-danger"
                          id="vehicleModel"
                          aria-label="Default select example"
                          required
                          disabled
                        >
                          <option selected value=" ">
                            Select {makeName && makeName} Model
                          </option>
                        </select>

                        <div id="CityHelp" className="form-text text-danger">
                          Select make first
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {modelName && modelName !== " " && (
                  <div className="col-lg-3 col-md-6 col-12">
                    {makeId && modelName !== " " && modelYear?.length > 0 ? (
                      <div className="mb-3">
                        <label for="vehicleYear" className="form-label">
                          Year
                        </label>
                        <select
                          className="form-select"
                          id="vehicleYear"
                          aria-label="Default select example"
                          required
                          value={yearName}
                          onChange={(e) => setYearName(e.target.value)}
                        >
                          <option selected value=" ">
                            Select {modelName && modelName} Year
                          </option>
                          {modelYear &&
                            modelYear.map((item) => (
                              <option key={item.yearId} value={item.yearId}>
                                {item.year}
                              </option>
                            ))}
                        </select>

                        <div id="CityHelp" className="form-text">
                          Mention your vehicle's Year (e.g. 2018)
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label for="vehicleYear" className="form-label">
                          Year
                        </label>
                        <select
                          className="form-select border-danger"
                          id="vehicleYear"
                          aria-label="Default select example"
                          required
                          disabled
                        >
                          <option selected value=" ">
                            Select Year
                          </option>
                        </select>
                        <div id="CityHelp" className="form-text text-danger">
                          Select Model first
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {yearName && yearName !== " " && (
                  <div className="col-lg-3 col-md-6 col-12 text-start">
                    {modelName && yearName !== " " && variantList.length > 0 ? (
                      <div className="mb-3 text-start">
                        <label for="vehicleYear" className="form-label">
                          Variant (optional)
                          {/* <span  className="form-text"> (Optional) </span> */}
                        </label>
                        <select
                          className="form-select"
                          id="vehicleYear"
                          aria-label="Default select example"
                          value={variant}
                          onChange={(e) => setVariant(e.target.value)}
                        >
                          <option selected value=" ">
                            Select {modelName && modelName}{" "}
                            {yearName && yearName} Variant
                          </option>
                          {variantList &&
                            variantList.map((item) => (
                              <option
                                key={item.featuresId}
                                value={item.featuresId}
                              >
                                {item.featureName}
                              </option>
                            ))}
                        </select>

                        <div id="CityHelp" className="form-text">
                          Mention {modelName && modelName}{" "}
                          {yearName && yearName} Variant
                        </div>
                      </div>
                    ) : modelName &&
                      yearName !== " " &&
                      variantList.length === 0 ? (
                      <>
                        <label
                          for="vehicleYear"
                          className="form-label text-start"
                        >
                          Variant
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="varient"
                          aria-describedby="VarientHelp"
                          value={variant}
                          onChange={(e) => setVariant(e.target.value)}
                        />
                        <div id="VarientHelp" className="form-text text-danger">
                          Mention {modelName && modelName}{" "}
                          {yearName && yearName} Varient
                        </div>
                      </>
                    ) : (
                      <div className="mb-3">
                        <label for="vehicleYear" className="form-label">
                          Variant
                        </label>
                        <select
                          className="form-select border-danger"
                          id="vehicleYear"
                          aria-label="Default select example"
                          required
                          disabled
                        >
                          <option selected value=" ">
                            Select Variant
                          </option>
                        </select>
                        <div id="CityHelp" className="form-text text-danger">
                          Select Year first
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {yearName && yearName !== " " && (
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="mb-3">
                      <label for="categoryName" className="form-label">
                        Engine Size (cc)
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="categoryName"
                        aria-describedby="categoryName"
                        placeholder="Engine Capacity (cc)"
                        required
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="col-lg-3 col-md-6 col-12">
                  <div className="mb-3">
                    <label for="post-registeration" className="form-label">
                      Registered In
                    </label>
                    <select
                      className="form-select"
                      id="post-registeration"
                      aria-label="Default select example"
                      required
                      placeholder="Registered In"
                      value={registeredIn}
                      onChange={(e) => setRegisteredIn(e.target.value)}
                    >
                      <option selected value=" ">
                        Select
                      </option>
                      <option value="Unregistered">Unregistered</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="KPK">KPK</option>
                      <option value="Balochistan">Balochistan</option>
                    </select>
                  </div>
                </div>
                {registeredIn !== "Unregistered" && (
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="mb-3">
                      <label for="registrationYear" className="form-label">
                        Registration Year
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="registrationYear"
                        aria-describedby="registrationYear"
                        placeholder="Enter Registration Year"
                        value={registrationYear}
                        onChange={(e) => setRegistrationYear(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="col-lg-3 col-md-6 col-12">
                  <div className="mb-3">
                    <label for="vehicleTransmission" className="form-label">
                      Transmission
                    </label>
                    <select
                      className="form-select"
                      id="vehicleTransmission"
                      aria-label="Default select example"
                      required
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                    >
                      <option selected value=" ">
                        Select
                      </option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-12">
                  <div className="mb-3">
                    <label for="vehicleAssembly" className="form-label">
                      Assembly
                    </label>
                    <select
                      className="form-select"
                      id="vehicleAssembly"
                      aria-label="Default select example"
                      required
                      value={assembly}
                      onChange={(e) => setAssembly(e.target.value)}
                    >
                      <option selected value=" ">
                        Select Assembly
                      </option>
                      <option value="Local">Local</option>
                      <option value="Imported">Imported</option>
                    </select>
                  </div>
                </div>
                {assembly === "Imported" && (
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="mb-3">
                      <label for="importYear" className="form-label">
                        Import Year
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="importYear"
                        aria-describedby="importYear"
                        placeholder="Enter Import Year"
                        required
                        value={importYear}
                        onChange={(e) => setImportYear(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="col-lg-3 col-6">
                  <div className="mb-3">
                    <label for="post-color" className="form-label">
                      Enter your vehicle color
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="post-color"
                      aria-describedby="CityHelp"
                      placeholder="Enter Your Vehicle Color"
                      required
                      value={vehicleColour}
                      onChange={(e) => setVehicleColour(e.target.value)}
                    />
                    <div id="CityHelp" className="form-text">
                      Mention your vehicle's color (e.g. White)
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12 ">
                  <div className="mb-3">
                    <label for="post-registeration" className="form-label">
                      Vehicle Fuel
                    </label>
                    <div className="d-flex justify-content-start flex-wrap">
                      <div className="form-check form-check-inline md-radioStyle p-0">
                        <input
                          className="form-check-input radio-input"
                          type="radio"
                          name="vehicleFuel"
                          id="vehiclePetrol"
                          value="Petrol"
                          checked={vehicleFuel === "Petrol"}
                          onChange={(e) => setVehicleFuel(e.target.value)}
                        />
                        <label
                          className="form-check-label radio-label"
                          for="vehiclePetrol"
                        >
                          Petrol
                        </label>
                      </div>
                      <div className="form-check form-check-inline md-radioStyle p-0">
                        <input
                          className="form-check-input radio-input"
                          type="radio"
                          name="vehicleFuel"
                          id="vehicleDiesel"
                          value="Diesel"
                          checked={vehicleFuel === "Diesel"}
                          onChange={(e) => setVehicleFuel(e.target.value)}
                        />
                        <label
                          className="form-check-label radio-label"
                          for="vehicleDiesel"
                        >
                          Diesel
                        </label>
                      </div>
                      <div className="form-check form-check-inline md-radioStyle p-0">
                        <input
                          className="form-check-input radio-input"
                          type="radio"
                          name="vehicleFuel"
                          id="vehicleHybrid"
                          value="Hybrid"
                          checked={vehicleFuel === "Hybrid"}
                          onChange={(e) => setVehicleFuel(e.target.value)}
                        />
                        <label
                          className="form-check-label radio-label"
                          for="vehicleHybrid"
                        >
                          Hybrid
                        </label>
                      </div>
                      <div className="form-check form-check-inline md-radioStyle p-0">
                        <input
                          className="form-check-input radio-input"
                          type="radio"
                          name="vehicleFuel"
                          id="vehicleCNG"
                          value="CNG"
                          checked={vehicleFuel === "CNG"}
                          onChange={(e) => setVehicleFuel(e.target.value)}
                        />
                        <label
                          className="form-check-label radio-label"
                          for="vehicleCNG"
                        >
                          CNG
                        </label>
                      </div>
                      <div className="form-check form-check-inline md-radioStyle p-0">
                        <input
                          className="form-check-input radio-input"
                          type="radio"
                          name="vehicleFuel"
                          id="vehicleElectric"
                          value="Electric"
                          checked={vehicleFuel === "Electric"}
                          onChange={(e) => setVehicleFuel(e.target.value)}
                        />
                        <label
                          className="form-check-label radio-label"
                          for="vehicleElectric"
                        >
                          Electric
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                  <div>
                    <label for="vehicleKM" className="form-label">
                      Mileage * (km)
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        id="vehicleKM"
                        placeholder="Mileage"
                        min="0"
                        required
                        value={milage}
                        onChange={(e) => setMilage(e.target.value)}
                      />
                      <span
                        className="input-group-text text-white"
                        id="basic-addon2"
                      >
                        KM
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                  <div>
                    <label for="postPrice" className="form-label">
                      Asking Price* (PKR.)
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        id="postPrice"
                        placeholder="Price"
                        min="1000"
                        required
                        aria-describedby="vehiclePrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <span
                        className="input-group-text text-white"
                        id="basic-addon2"
                      >
                        PKR
                      </span>
                    </div>
                    <div
                      id="vehiclePrice"
                      className="form-text"
                      style={{ height: 25, textTransform: "capitalize" }}
                    >
                      {formatPrice(price)}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="mb-3">
                    <label for="post-city" className="form-label">
                      City
                    </label>
                    <select
                      className="form-select"
                      id="post-city"
                      aria-label="Default select example"
                      required
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                    >
                      <option selected value=" ">
                        Select City
                      </option>
                      {cities &&
                        cities.map((item) => (
                          <option key={item?.cityID} value={item.cityID}>
                            {item.cityName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-lg-12 col-12 mb-5">
                  <label for="vehicleDescription" className="form-label">
                    Ad Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="vehicleDescription"
                    aria-describedby="vehicleDescription"
                    required
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <div id="vehicleDescription" className="form-text">
                    Describe Your car: <br></br>
                    Example: Alloy Rim, First Owner, Genuine Parts, Maintained
                    by Authorized Workshop, Excellent Mileage, Original Paint,
                    Original / Duplicate Book, Complete Service History,
                    Complete / Original / Incomplete / Duplicate File, Duplicate
                    Number Plate Auction Sheet, Token or Tax Up to Date, Engine
                    Repaired, Engine Swapped, etc.
                  </div>
                </div>

                <div className="col-lg-12 col-12">
                  <h6 className="fs-5 fw-700">Features</h6>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    ABS
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={abs === "true"}
                      onChange={(e) =>
                        setABS(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {abs === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Air Bags
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={airbags === "true"}
                      onChange={(e) =>
                        setAirBags(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {airbags === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    AC
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={airconditioning === "true"}
                      onChange={(e) =>
                        setAirConditioning(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {airconditioning === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    FM Radio
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={fm === "true"}
                      onChange={(e) =>
                        setFM(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {fm === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Cassette Player
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={cassettePlayer === "true"}
                      onChange={(e) =>
                        setCassettePlayer(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {cassettePlayer === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    CD Player
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={cdPlayer === "true"}
                      onChange={(e) =>
                        setCDPlayer(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {cdPlayer === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    DVD Player
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={dvdPlayer === "true"}
                      onChange={(e) =>
                        setDVDPlayer(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {dvdPlayer === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Climate Control
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={climateControl === "true"}
                      onChange={(e) =>
                        setClimateControl(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {climateControl === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Front Camera
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={frontCamera === "true"}
                      onChange={(e) =>
                        setFrontCamera(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {frontCamera === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Front Speakers
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={frontSpeakers === "true"}
                      onChange={(e) =>
                        setFrontSpeakers(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {frontSpeakers === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Heated Seats
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={heatedSeats === "true"}
                      onChange={(e) =>
                        setHeatedSeats(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {heatedSeats === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Immobilizer Key
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={immobilizerKey === "true"}
                      onChange={(e) =>
                        setImmobilizerKey(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {immobilizerKey === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Keyless Entry
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={keylessEntry === "true"}
                      onChange={(e) =>
                        setKeylessEntry(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {keylessEntry === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Navigation System
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={navigationSystem === "true"}
                      onChange={(e) =>
                        setNavigationSystem(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {navigationSystem === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Power Locks
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={powerLocks === "true"}
                      onChange={(e) =>
                        setPowerLocks(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {powerLocks === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Power Mirrors
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={powerMirrors === "true"}
                      onChange={(e) =>
                        setPowerMirrors(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {powerMirrors === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Power Steering
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={powerSteering === "true"}
                      onChange={(e) =>
                        setPowerSteering(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {powerSteering === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Power Windows
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={powerWindows === "true"}
                      onChange={(e) =>
                        setPowerWindows(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {powerWindows === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>

                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Rear AC Vents
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={rearACVents === "true"}
                      onChange={(e) =>
                        setRearACVents(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {rearACVents === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Rear Camera
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={rearCamera === "true"}
                      onChange={(e) =>
                        setRearCamera(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {rearCamera === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Rear Seat Entertainment
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={rearSeatEntertainment === "true"}
                      onChange={(e) =>
                        setRearSeatEntertainment(
                          e.target.checked ? "true" : "false"
                        )
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {rearSeatEntertainment === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Rear Speakers
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={rearSpeakers === "true"}
                      onChange={(e) =>
                        setRearSpeakers(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {rearSpeakers === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Steering Switches
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={steeringSwitches === "true"}
                      onChange={(e) =>
                        setSteeringSwitches(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {steeringSwitches === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Sun Roof
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={sunRoof === "true"}
                      onChange={(e) =>
                        setSunRoof(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {sunRoof === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    USB and Auxillary Cable
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={usb === "true"}
                      onChange={(e) =>
                        setUSB(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {usb === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
                <div className="col-lg-2 col-4">
                  <label
                    for="featurecheck"
                    className="form-label customCheck_label"
                  >
                    Alloy Rims
                  </label>
                  <div className="PostSwitch form-check form-switch d-flex justify-content-between align-items-center ">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={alloyRims === "true"}
                      onChange={(e) =>
                        setAlloyRims(e.target.checked ? "true" : "false")
                      }
                    />
                    <label
                      className="form-check-label PostSwitch_label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {alloyRims === "true" ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-center pt-5 ">
                <h4 className="pb-3">Contact Information</h4>
              </div>
              <div className="row mb-3">
                <div className="col-lg-6 col-12">
                  <div className="mb-3">
                    <label for="posterMobileNumber" className="form-label">
                      Mobile Number *
                    </label>
                    <InputMask
                      mask="03999999999"
                      maskChar={null}
                      type="text"
                      className="form-control"
                      id="posterMobileNumber"
                      aria-describedby="MobileNumberHelp"
                      placeholder="Enter Your Mobile Number"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <div id="MobileNumberHelp" className="form-text">
                      Enter a genuine 11 digit mobile no. with format
                      03XXXXXXXXX. <br></br> All inquires will come on this
                      number.
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-12">
                  <div className="mb-3">
                    <label for="posterMobileSecond" className="form-label">
                      Secondary Mobile Number (Optional)
                    </label>
                    <InputMask
                      mask="99999999999"
                      maskChar={null}
                      type="text"
                      className="form-control"
                      id="posterMobileNumber"
                      aria-describedby="MobileNumberHelp"
                      placeholder="Secondary Mobile Number"
                    />
                  </div>
                </div>
              </div>
              <div className="postAdForm ">
                <ul className="color-secondary">
                  <li>I accpet my car is CPLC clear.</li>
                  <li>I accept the documents and No. Plates are original.</li>
                  <li>Inspection & valuation will be done by Famewheels.</li>

                  <li>
                    0.5% of the selling amount will be charged by FameWheels.
                  </li>
                </ul>

                <div className="col-md-12 col-12 mb-1">
                  <div className="mb-1 form-check md-radioStyle2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Check4"
                      required
                    />
                    <label
                      className="form-check-label"
                      style={{ fontSize: "15px" }}
                    >
                      I agree to the terms of the{" "}
                      <span className="cursor-pointer" onClick={openTerms}>
                        <u>
                          {" "}
                          FameWheels Bidding Agreement and the Privacy Policy
                        </u>
                      </span>
                      .
                    </label>
                    <div className="form-text">
                      In case of any false information your request will be
                      rejected!
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center pt-3">
                <button
                  type="submit"
                  className="btn fw-secondary postFormBtn"
                  disabled={postDisabled}
                  style={
                    postDisabled
                      ? { backgroundColor: "#b8050550" }
                      : { backgroundColor: "#b80505" }
                  }
                >
                  {postDisabled ? "Complete to continue" : " Request Bidding"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Modal
          open={isSubmitting}
          onClose={() => setIsSubmitting(false)}
          disableAutoFocus={true}
          className="timerModal"
        >
          <Box className="text-center successModal " sx={successModal}>
            <img
              className="modalLoaderImg"
              src={TimerLoader}
              alt="Loading..."
              srcSet=""
            />
          </Box>
        </Modal>

        <Modal
          open={openSuccessModal}
          onClose={() => setOpenSuccessModal(false)}
          disableAutoFocus={true}
        >
          <Box className="text-center successModal" sx={successModal}>
            <h3>Success!</h3>
            <h5>Your Request Generated Successfully.</h5>
            <p>We'll Be In Touch Shortly. </p>
          </Box>
        </Modal>
      </div>
    </>
  );
}
