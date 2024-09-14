import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editASpot, selectSpotById } from "../../store/spots";

const IMAGE_FORMAT = ['png', 'jpg', 'jpeg'];

export const EditSpotForm = () => {
  const {id} = useParams();
  const spot = useSelector(state => selectSpotById(state, id));
  const images = [...spot.SpotImages];

  const dispatch = useDispatch();
  const [country, setCountry] = useState(spot.country);
  const [state, setState] = useState(spot.state);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [previewImg, setPreviewImg] = useState(images.find(image => image.preview).url);
  const [img1, setImg1] = useState(images.filter(image => !image.preview)[0].url || '')
  const [img2, setImg2] = useState(images.filter(image => !image.preview)[1].url || '')
  const [img3, setImg3] = useState(images.filter(image => !image.preview)[2].url || '')
  const [img4, setImg4] = useState(images.filter(image => !image.preview)[3].url || '')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();


  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});
    const editSpot = {
      id,
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: price && parseInt(price),
    }

    const otherImages = [
     img1,
     img2,
     img3,
     img4
    ]

    const checkPreview = await checkImage(previewImg)
    .then(data => data)
    .catch(err => err);

    if(otherImages.length){
      for(const [index, image] of otherImages.entries()){
        let check = false
        IMAGE_FORMAT.forEach(format => {
          if(image.includes(format)){
            check = true
          }
        })
        if(!check) setErrors(currentErr =>
          currentErr = {...currentErr, [`img${index + 1}`]: 'Image URL must end in .png, .jpg, or .jpeg'}
        )
      }
    }

    const spotResponse = await dispatch(editASpot(editSpot))
    .then(data => data)
    .catch(err => err && typeof err.json == 'function' ? err.json() : err);


    if(spotResponse.errors){
      setErrors(currentErr => currentErr = {...currentErr, ...spotResponse.errors})
    }
    if(!checkPreview) {
      setErrors({preview: 'Preview image is required.'});
    }
    if(spotResponse.errors || !checkPreview) return
    else{
      navigate(`/spots/${id}`)
    }
  }


  async function checkImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(true);

        img.onerror = () => reject(false);

        img.src = url;
    });
  }

  return(
    <form
    className="new-spot-form"
    onSubmit={submitHandler}>
      <section>
      <h2>Create a New Spot</h2>
        <h3>Where&apos;s your place located?</h3>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <label>
          <div className="label-error">
            <p>Country</p><p style={{color:'red'}}>{errors.country && errors.country}</p>
          </div>
          <input
          value={country}
          placeholder={"Country"}
          onChange={ e => setCountry(e.target.value)}
          ></input>
        </label>
        <label>
        <div className="label-error">
            <p>Street Address</p><p style={{color:'red'}}>{errors.address && errors.address}</p>
          </div>
          <input
          value={address}
          placeholder="Address"
          onChange={ e => setAddress(e.target.value)}
          >
          </input>
        </label>
        <div className="city-state">
          <label id="city">
            <div className="label-error">
              <p>City</p><p style={{color:'red'}}>{errors.city && errors.city}</p>
            </div>
            <input
            value={city}
            placeholder="City"
            onChange={ e => setCity(e.target.value)}
            >
            </input>
          </label>
          {/* <p className="comma">,</p> */}
          <label id="state">
            <div className="label-error">
              <p>State</p><p style={{color:'red'}}>{errors.state && errors.state}</p>
            </div>
            <input
            value={state}
            placeholder="STATE"
            onChange={ e => setState(e.target.value)}
            >
            </input>
          </label>
        </div>
        <div className="lat-long">
          <label id="lat">
          <div className="label-error">
            <p>Latitude</p><p style={{color:'red'}}>{errors.lat && errors.lat}</p>
          </div>
          <input
          value={lat}
          placeholder="Latitude"
          onChange={ e => setLat(e.target.value)}
          >
          </input>
          </label>
          {/* <p className="comma">,</p> */}
          <label id="long">
          <div className="label-error">
            <p>Longitude</p><p style={{color:'red'}}>{errors.lng && errors.lng}</p>
          </div>
          <input
          value={lng}
          placeholder="Longitude"
          onChange={ e => setLng(e.target.value)}
          >
          </input>
          </label>
        </div>
      </section>
      <section className="describe-text-area">
        <div>
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space,
            any special amentities like fast wifi or
            parking and what you love about the neighborhood.
          </p>
        </div>
        <textarea
        value={description}
        placeholder="Description"
        onChange={ e => setDescription(e.target.value)}
        ></textarea>
        <p style={{color:'red'}}>{errors.description && errors.description}</p>
      </section>
      <section>
        <h3>Create a title for your spot</h3>
        <p>
          Catch guests&apos; attention with a spot title that
          highlights what makes your place special.
        </p>
        <input
        value={name}
        placeholder="Name of your spot"
        onChange={ e => setName(e.target.value)}
        >
        </input>
        <p style={{color: 'red'}}>{errors.name && errors.name}</p>
      </section>
      <section>
        <h3>Set a base price for your spot</h3>
        <p>
          Competitive pricing can help your listing stand
          out and rank higher in search results.
        </p>
        <div style={{display:'flex', gap:'5px'}}>
          <p>$</p>
          <input
          value={price}
          placeholder="Price per night(USD)"
          step={0.01}
          type="number"
          min={0}
          onChange={e => setPrice(e.target.value)}
          >
          </input>
        </div>
        <p style={{color:'red'}}>{errors.price && errors.price}</p>
      </section>
      <section>
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input
        value={previewImg}
        placeholder="Preview Image URL"
        onChange={ e => setPreviewImg(e.target.value)}
        ></input>
        <p style={{color: 'red'}}>{errors.preview && errors.preview}</p>
        <input
        value={img1}
        placeholder="Image URL"
        onChange={ e => setImg1(e.target.value)}
        ></input>
        <p style={{color: 'red'}}>{errors.img1 && errors.img1}</p>
        <input
        value={img2}
        placeholder="Image URL"
        onChange={ e => setImg2(e.target.value)}
        ></input>
        <p style={{color: 'red'}}>{errors.img2 && errors.img2}</p>
        <input
        value={img3}
        placeholder="Image URL"
        onChange={ e => setImg3(e.target.value)}
        ></input>
        <p style={{color: 'red'}}>{errors.img3 && errors.img3}</p>
        <input
        value={img4}
        placeholder="Image URL"
        onChange={ e => setImg4(e.target.value)}
        ></input>
        <p style={{color: 'red'}}>{errors.img4 && errors.img4}</p>
      </section>
      <button
      type="submit"
      id="submit-form-btn"
      >
        Create Spot
      </button>
    </form>
  )
}
