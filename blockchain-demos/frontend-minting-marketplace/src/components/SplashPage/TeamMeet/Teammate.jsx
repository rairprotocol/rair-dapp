import React from 'react'

const Teammate = ({ url, nameTeammate, desc, primaryColor }) => {
    return (
        <div className="box-teammate">
            <div className="img-teammate">
                <img src={url} alt="photo" />
            </div>
            <div className="position-teammate">
                <div className="temmate-content-up">
                    <h4>{nameTeammate}</h4>
                    <div className="teammate-description">
                        {
                            desc.map((p, index) => {
                                return <p key={index} style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>{p}</p>
                            })
                        }
                    </div>
                </div>
                <div className="box-socials">
                    <span className="text-gradient"><i className="fab fa-twitter"></i></span>
                    <span className="text-gradient"><i className="fab fa-linkedin-in"></i></span>
                </div>
            </div>
        </div>
    )
}

export default Teammate
