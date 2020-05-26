import React, { Fragment, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRatings from 'react-star-ratings';


function StarRating() {
    const [rating, setRating] = useState(5);

    function changeRating(newRating) {
        if (newRating<1){
            setRating(1)

        }
        setRating(newRating)
        console.log(newRating);
        

    }

    return (
        <Fragment>
                            <StarRatings
                                rating={rating}
                                starRatedColor="yellow"
                                changeRating={changeRating}
                                numberOfStars={5}
                                name='rating'
                                starDimension="20px"
                                starSpacing="5px"
                                
                            />

        </Fragment>
    )
}

export default StarRating;