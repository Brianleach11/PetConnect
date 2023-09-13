export default async function ChatLayout({
    children,
  }: {
    children: React.ReactNode
  }) 
  {
    return(
        <div className='h-screen bg-whiteGreen'>
            <div className='h-screen pt-12 antialiased'>
                {children}
            </div>
        </div>
    )
  }