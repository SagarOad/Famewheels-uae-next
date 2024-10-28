import React from 'react'
import Grid from "@mui/material/Grid";

const OurVideos = () => {
  return (
    <>
     <div className="container py-5">
          <h2 className="text-start section-titles pb-2">Browse Our Videos</h2>
          <Grid container>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/SzRxMXNgxJA"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/js4GdflL1Cs"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/cvYzV_ig2Po"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
            <Grid lg={3} md={6} sm={6} xs={12} className="px-1 pb-1">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/dR1Z5RMkfNQ"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </Grid>
          </Grid>
        </div>
    </>
  )
}

export default OurVideos