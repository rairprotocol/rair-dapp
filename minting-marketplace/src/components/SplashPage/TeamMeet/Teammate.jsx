import React from 'react'

const Teammate = ({ url, name, desc, primaryColor, socials }) => {
    return (
        <div className="box-teammate">
            <div className="img-teammate">
                <img src={url} alt="teamate-img" />
            </div>
            <div className="position-teammate">
                <div className="temmate-content-up">
                    <div className="teammate-title-socials">
                        <div>
                            <h4>{name}</h4>
                        </div>
                        <div className="box-socials">
                            {
                                socials && socials.map((social, index) => {
                                    return <span key={social + index}>
                                        <a className={social.classLink} target="_blank" href={social.link} rel="noreferrer">
                                            <i className={social.classIcon}></i>
                                        </a>
                                    </span>
                                })
                            }

                        </div>
                    </div>
                    <div className="teammate-description">
                        {
                            desc.map((p, index) => {
                                return <p key={index} style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>{p}</p>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Teammate
