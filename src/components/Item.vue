<template>
    <div class="list-item"> 
        <div class="list-item-details">
            <!-- <div class="labels"></div> -->
            <div class="item-title">{{item.title}}</div>
            <!-- <div class="tags"></div> -->
        </div>
        {{item.name}}
    </div>
</template>

<script>

export default {
    props:['item'],
}
</script>