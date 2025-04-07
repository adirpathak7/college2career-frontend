import React from 'react'
import { useLoader } from '../LoaderContext'
import { PropagateLoader } from 'react-spinners'

export default function Loader() {

    const { loading } = useLoader()

    if (!loading) return null

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
            <PropagateLoader color='#ffffff' />
        </div >
    )
}
