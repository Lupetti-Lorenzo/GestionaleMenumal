
<script>
//tailwind css
import "../app.css";

import  Nav  from "$lib/components/layout/nav.svelte"
</script>

<svelte:head>
    <style>
        body {
            padding: 10px;
        }
    </style>
</svelte:head>

<Nav />

<slot></slot>