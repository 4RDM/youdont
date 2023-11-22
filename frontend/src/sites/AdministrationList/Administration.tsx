import React, { useEffect, useState } from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import Loading from '../../compontents/Loading/Loading'
import toast from 'react-hot-toast'

import './Administration.scss'

const ROLES: Record<string, [number, string]> = {
    "superadmin": [11, "Właściciel"],
    "zarzad": [10, "Zarząd"],
    "hadmin": [9, "Head Admin"],
    "senioradmin": [8, "Senior Admin"],
    "admin": [7, "Admin"],
    "junioradmin": [6, "Junior Admin"],
    "seniormoderator": [5, "Senior Moderator"],
    "moderator": [4, "Moderator"],
    "juniormoderator": [3, "Junior Moderator"],
    "support": [2, "Support"],
    "tsupport": [1, "Trial Support"]
};

export interface Admin {
    role: string
    avatar: string
    tag: string
    discord: string
}


type AdminList = Record<string, Admin>
type AdminListResponse = Record<string, { discord: string, users: Admin[] }>

export interface ApiResponse {
    code: number
    data: AdminList
}

export default () => {
    const [isLoading, setLoading] = useState(true);
    const [administration, setAdministration] = useState<AdminListResponse>({});

    useDocumentTitle('Administracja serwera')

    useEffect(() => {
        fetch('/api/adminlist')
            .then((x) => x.json())
            .then((json: ApiResponse) => {
                if (json.code !== 200) throw new Error(`Invalid response: ${JSON.stringify(json)}`);
                const temp: AdminListResponse = {};

                for (const role of Object.values(json.data)) {
                    if (!temp[role.role]) temp[role.role] = { discord: role.discord, users: [] };

                    temp[role.role].users.push(role);
                }

                setAdministration(temp);
                setLoading(false)
            })
            .catch((err) => {
                toast.error("Wystąpił błąd po stronie serwera!", { duration: 5000 });
                console.error(err)
                setLoading(false);
            })
    })

    return (
        <div id="administrationlist-container">
            <div id="administrationlist-head">
                <h1>Administracja 4RDM</h1>
            </div>
            <div id="administrationlist-list">
                {isLoading ? (
                    <Loading />
                ) : (
                    Object.keys(administration).sort((a, b) => ROLES[b][0] - ROLES[a][0]).map((role, i) => (
                        <div key={i} className="administrationlist-role">
                            <h1>{ROLES[role][1]}</h1>
                            <div className="administrationlist-role-list">
                                {administration[role].users.map((user, i) => (
                                    <div key={i} className="administrationlist-role-list-item">
                                        <img src={user.avatar || "https://4rdm.pl/assets/logo.png"} alt="avatar" />
                                        <div className="administrationlist-role-list-item-info">
                                            <h3>{user.tag}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
