interface Props{
    title:string;
}

export default function PageHeader({
    title,
}:Props){

return(

<header>

<h1>{title}</h1>

</header>

);

}