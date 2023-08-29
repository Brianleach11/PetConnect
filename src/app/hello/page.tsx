import NavBar from "@/components/NavBar";


export default async function Page () {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return(
        <>
            <NavBar/>
            <div>Hello!</div>
        </>
    )
}